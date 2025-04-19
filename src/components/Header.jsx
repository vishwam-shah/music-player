import React from 'react';

export default function Header() {
  return (
    <div className="p-4 bg-zinc-800 flex justify-between items-center">
      <input
        className="bg-zinc-700 text-white p-2 px-4 rounded-full w-full max-w-md"
        type="text"
        placeholder="What do you want to play?"
      />
    </div>
  );
}
