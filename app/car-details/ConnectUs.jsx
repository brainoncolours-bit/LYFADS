import React from 'react'

export const ConnectUs = () => {
  return (
    <section className="bg-black text-white py-16 px-4 md:px-8 md:my-12 bg-opacity-40">
  <div className="max-w-4xl mx-auto text-center">
    <h2 className="text-3xl md:text-5xl font-bold leading-tight">
      Didn&apos;t Find the Car You&apos;re Looking For?
    </h2>
    <p className="mt-4 text-gray-400 text-base md:text-lg">
      No worries! Let us know what you&apos;re looking for and we&apos;ll help you find your perfect ride.
    </p>
    <div className="mt-8">
      <a
        href="/contact"
        className="inline-block rounded-full bg-brand-color hover:bg-brand-color/90 text-white px-6 py-3 text-sm md:text-base font-semibold transition"
      >
        Connect with Us
      </a>
    </div>
  </div>
</section>
  )
}
