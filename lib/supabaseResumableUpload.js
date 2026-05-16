import * as tus from "tus-js-client";
import { supabase } from "@/lib/supabaseClient";

const RESUMABLE_CHUNK_SIZE = 6 * 1024 * 1024;

const getSupabaseUrl = () =>
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";

const getSupabaseAnonKey = () =>
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  "";

export const uploadResumableFile = async ({
  bucket,
  file,
  prefix,
  onProgress,
}) => {
  if (!file) return "";

  const supabaseUrl = getSupabaseUrl();
  if (!supabaseUrl) {
    throw new Error("Supabase URL is missing.");
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;

  const accessToken = sessionData?.session?.access_token;
  if (!accessToken) {
    throw new Error("User is not authenticated.");
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .substring(7)}.${fileExt}`;

  await new Promise((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint: `${supabaseUrl}/storage/v1/upload/resumable`,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: {
        authorization: `Bearer ${accessToken}`,
        apikey: getSupabaseAnonKey(),
        "x-upsert": "false",
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      chunkSize: RESUMABLE_CHUNK_SIZE,
      metadata: {
        bucketName: bucket,
        objectName: fileName,
        contentType: file.type,
        cacheControl: "3600",
      },
      onError: (error) => {
        const message =
          error?.originalResponse?.getBody?.() ||
          error?.message ||
          "Unable to upload video.";

        if (String(message).includes("maximum allowed size")) {
          reject(
            new Error(
              "This video is larger than the Supabase bucket limit. Set the bucket file size limit to 500MB, then try again."
            )
          );
          return;
        }

        reject(new Error(message));
      },
      onProgress: (bytesUploaded, bytesTotal) => {
        if (!bytesTotal || !onProgress) return;
        onProgress(Math.round((bytesUploaded / bytesTotal) * 100));
      },
      onSuccess: resolve,
    });

    upload.findPreviousUploads().then((previousUploads) => {
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }
      upload.start();
    });
  });

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
};
