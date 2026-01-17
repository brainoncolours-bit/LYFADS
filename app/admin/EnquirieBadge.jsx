"use client";
import { useEffect, useState } from 'react';
import { Modal, Switch, Input, Empty } from 'antd';
import { PhoneCall, Mail, Trash2, MessageSquare, CalendarClock, Clock, Plus } from 'lucide-react';
import { IconBrandWhatsappFilled } from '@tabler/icons-react';
import { useToast } from '@/components/ToastProvider';
import { supabase } from '@/lib/supabaseClient';
import Swal from 'sweetalert2';


export const EnquiryBadge = ({ enquiries, isModalOpen, setIsModalOpen,fetchProducts,fetchCarEnquiries }) => {
  const toast=useToast();
  const [localEnquiries, setLocalEnquiries] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]);
  const [notesInput, setNotesInput] = useState({});
  const [addNoteState, setAddNoteState] = useState({});

  // Sync from parent on open
  useEffect(() => {
    if (isModalOpen) {
      setLocalEnquiries(enquiries);
    }
  }, [isModalOpen, enquiries]);

  const updateEnquiry = (id, updatedFields) => {
    setLocalEnquiries((prev) =>
      prev.map((enq) =>
        enq.id === id ? { ...enq, ...updatedFields } : enq
      )
    );
  };

  const toggleAttended = async (id, currentValue) => {
    setLoadingIds((prev) => [...prev, id]);
    const { error } = await supabase.from("enquiries").update({ attended: !currentValue }).eq("id", id);
    if (error) {
      toast.error("Failed to update", "attended-toggle");
    } else {
      updateEnquiry(id, { attended: !currentValue });
      toast.success("Updated successfully", "attended-toggle");
    }
    setLoadingIds((prev) => prev.filter((i) => i !== id));
  };

  const handleAddNote = async (record) => {
    const note = notesInput[record.id]?.trim();
    if (!note) return;

    const newNotes = [...(record.notes || []), note];
    const { error } = await supabase.from("enquiries").update({ notes: newNotes }).eq("id", record.id);
    if (error) {
      toast.error("Failed to add note", "note-add");
    } else {
      updateEnquiry(record.id, { notes: newNotes });
      setNotesInput((prev) => ({ ...prev, [record.id]: "" }));
      setAddNoteState((prev) => ({ ...prev, [record.id]: false }));
      toast.success("Note added", "note-add");
    }
  };

  const handleDeleteNote = async (record, index) => {
    const newNotes = [...(record.notes || [])];
    newNotes.splice(index, 1);

    const { error } = await supabase.from("enquiries").update({ notes: newNotes }).eq("id", record.id);
    if (error) {
      toast.error("Failed to delete note", "note-delete");
    } else {
      updateEnquiry(record.id, { notes: newNotes });
      toast.success("Note deleted", "note-delete");
    }
  };

    const itemDelete = async (item) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete ${item.user_name} enquiry?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      const { error } = await supabase.from('enquiries').delete().eq('id', item.id);

      if (error) {
        toast.error('Failed to delete item: ' + error.message);
      } else {
        toast.success('Enquiry deleted ');
        setLocalEnquiries((prev)=>prev.filter(enq=>enq.id!==item.id))
        fetchCarEnquiries();
      }
    }
  };
  return (
    <Modal
      title="All Enquiries"
      open={isModalOpen}
      onCancel={() =>{ setIsModalOpen(false)
        fetchCarEnquiries()
      }}
      footer={null}
      width={800}
      centered
      modalRender={(modal) => (
    <div className="w-full h-screen sm:h-auto sm:rounded-lg overflow-y-auto">{modal}</div>
  )}
    >
      {localEnquiries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:max-h-[80vh] overflow-y-auto p-2">
          {localEnquiries
            .filter((item) => item.car_id === isModalOpen)
            .map((record) => {
              const isAdding = addNoteState[record.id] || false;
              const newNote = notesInput[record.id] || "";

              return (
                <div key={record.id} className={`rounded-lg overflow-hidden shadow-md border ${record.attended ? "border-green-400" : "border-blue-400"}`}>
                  <div className={`p-3 text-white flex justify-between ${record.attended ? "bg-green-600" : "bg-blue-600"}`}>
                    <h3 className="truncate font-semibold text-lg">{record.user_name || "Unknown"}</h3>
                    <div className="flex gap-2">
                      <a href={`https://wa.me/${record.user_mobile}`} target="_blank" rel="noopener noreferrer" className="bg-green-500 p-2 rounded-full">
                        <IconBrandWhatsappFilled size={18} />
                      </a>
                      <a href={`tel:${record.user_mobile}`} className="bg-blue-500 p-2 rounded-full">
                        <PhoneCall size={18} />
                      </a>
                      <button
                        onClick={() => itemDelete(record)}
                      className="bg-red-500 p-2 rounded-full">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border-b">
                    <div className="capitalize font-medium">{record.model_name?.replace(/-/g, " ") || "N/A"}</div>
                  </div>

                  {record.test_drive_date && (
                    <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400">
                      <div className="text-yellow-700 font-medium mb-1 flex items-center">
                        <CalendarClock size={18} className="mr-2" /> Test Drive Requested
                      </div>
                      <div className="text-sm text-gray-700 pl-6">
                        {record.message}
                      </div>
                      <div className="text-sm text-gray-700 pl-6">
                        {record.test_drive_date}
                        {record.test_drive_time && (
                          <span className="ml-3 inline-flex items-center text-sm text-gray-500">
                            <Clock size={14} className="mr-1" /> {record.test_drive_time}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex justify-between mb-2 text-sm text-gray-600">
                      <a href={`mailto:${record.user_email}`} className="hover:underline flex items-center gap-1">
                        <Mail size={16} /> {record.user_email || "N/A"}
                      </a>
                      <a href={`tel:${record.user_mobile}`} className="hover:underline flex items-center gap-1">
                        <PhoneCall size={16} /> {record.user_mobile || "N/A"}
                      </a>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <span className="font-medium">Mark as Attended</span>
                      <Switch checked={record.attended} onChange={() => toggleAttended(record.id, record.attended)} />
                    </div>

                    {record.attended && (
                      <div className="mt-4">
                        <ul className="space-y-2 mb-3">
                          {record.notes?.length > 0 ? (
                            record.notes.map((n, idx) => (
                              <li key={idx} className="bg-green-50 border px-4 py-2 rounded-md flex justify-between items-start">
                                <span className="text-sm">{n}</span>
                                <button onClick={() => handleDeleteNote(record, idx)} className="text-red-500">
                                  <Trash2 size={16} />
                                </button>
                              </li>
                            ))
                          ) : (
                            <li className="text-sm text-gray-500 italic">No notes yet.</li>
                          )}
                        </ul>

                        {isAdding ? (
                          <div className="flex gap-2">
                            <Input.TextArea
                              autoFocus
                              rows={2}
                              value={newNote}
                              onChange={(e) =>
                                setNotesInput((prev) => ({ ...prev, [record.id]: e.target.value }))
                              }
                            />
                            <button onClick={() => handleAddNote(record)} className="bg-green-600 text-white px-3 py-2 rounded-md">
                              <Plus size={18} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              setAddNoteState((prev) => ({ ...prev, [record.id]: true }))
                            }
                            className="text-green-600 hover:underline mt-2"
                          >
                            + Add Note
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <Empty description="No enquiries found" />
      )}
    </Modal>
  );
};
