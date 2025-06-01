import { useState } from "react";

const TableOfContents = () => {
  const [activeId, setActiveId] = useState("pengertian-stunting");

  const sections = [
    { id: "pengertian-stunting", title: "Pengertian Stunting", number: 1 },
    { id: "penyebab-stunting", title: "Penyebab Stunting", number: 2 },
    { id: "dampak-jangka-panjang", title: "Dampak Jangka Panjang", number: 3 },
    { id: "pencegahan-stunting", title: "Pencegahan Stunting", number: 4 },
    { id: "kesimpulan", title: "Kesimpulan", number: 5 },
  ];

  return (
    <div className="bg-white -800 rounded-3xl shadow-sm p-6">
      <h2 className="text-lg font-bold mb-4 text-gray-900 ">
        Daftar Isi
      </h2>
      <ul className="space-y-3">
        {sections.map((section) => {
          const isActive = section.id === activeId;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={() => setActiveId(section.id)}
                className={`flex items-center transition-colors duration-200 ${
                  isActive
                    ? "text-[#317BC4] font-bold"
                    : "text-gray-700 -300 hover:text-[#317BC4] -blue-400"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm transition-colors duration-200 ${
                    isActive
                      ? "bg-[#D7EBFC] text-[#317BC4] font-bold"
                      : "bg-gray-100 -700 text-gray-700 -300 font-medium"
                  }`}
                >
                  {section.number}
                </div>
                <span>{section.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TableOfContents;
