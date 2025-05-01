import { useState } from 'react';

const TopBar = () => {
    const [hovered, setHovered] = useState(false)
  
    return (
      <div
        className={`transition-all duration-300 px-4 py-2 ${
          hovered ? 'bg-[#FFF0DC]/80' : 'bg-[#FFF0DC]/30'
        } fixed top-0 w-full z-10 flex justify-end`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative group">
          <button className="text-[#543A14] font-bold">Recent Moves</button>
          <div className="absolute left-0 mt-2 bg-white/60 text-[#131010] text-move-list p-2 rounded shadow-lg hidden group-hover:block">
            {/* Render move list here */}
            <ol className="list-decimal pl-5 space-y-1">
              <li>e4 e5</li>
              <li>d4 exd4</li>
              {/* ... */}
            </ol>
          </div>
        </div>
      </div>
    )
  }
  export default TopBar;
