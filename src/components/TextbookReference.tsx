import React, { useState } from 'react';
import { BookOpen, Table, ZoomIn, Eye, ExternalLink } from 'lucide-react';

export const TextbookReference: React.FC = () => {
  const [selectedScan, setSelectedScan] = useState<1 | 2>(1);
  const [showFullImage, setShowFullImage] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <BookOpen className="w-4 h-4" />
            <span>Tài Liệu Chuẩn SGK Tin Học 10 (Kết Nối Tri Thức)</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Bảng tra cứu thuộc tính các hình khối (Bài 13)
          </h3>
        </div>

        {/* Scan selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setSelectedScan(1)}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap ${
              selectedScan === 1
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Trang 69 (Hình 13.1 & Bảng 1)
          </button>
          <button
            onClick={() => setSelectedScan(2)}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap ${
              selectedScan === 2
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Trang 70 (Hình 13.2 & Câu hỏi)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Left: Accurate Textbook Table (7 cols) */}
        <div className="lg:col-span-7 overflow-x-auto">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Table className="w-4 h-4 text-emerald-600" />
            <span>Bảng các thuộc tính cơ bản của một số hình có sẵn trong Inkscape</span>
          </h4>

          {/* Desktop Table View */}
          <div className="hidden sm:block">
            <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4 border-b border-slate-200 dark:border-slate-700">Đối tượng</th>
                  <th className="py-3 px-4 border-b border-slate-200 dark:border-slate-700">Thuộc tính</th>
                  <th className="py-3 px-4 border-b border-slate-200 dark:border-slate-700">Ý nghĩa chuẩn SGK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                {/* Rectangle */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td rowSpan={2} className="py-3 px-4 font-semibold text-blue-700 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/20 border-r border-slate-200 dark:border-slate-800 align-top">
                    Hình vuông, hình chữ nhật
                  </td>
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-900 dark:text-white">W, H</td>
                  <td className="py-2.5 px-4">Chiều rộng, chiều dài.</td>
                </tr>
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-900 dark:text-white">Rx, Ry</td>
                  <td className="py-2.5 px-4">Bán kính của góc bo (bằng 0 nếu góc của hình là góc vuông).</td>
                </tr>

                {/* Ellipse */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td rowSpan={2} className="py-3 px-4 font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20 border-r border-slate-200 dark:border-slate-800 align-top">
                    Hình tròn, hình elip
                  </td>
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-900 dark:text-white">Rx, Ry</td>
                  <td className="py-2.5 px-4">Bán kính theo phương ngang và thẳng đứng.</td>
                </tr>
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-900 dark:text-white">Start, End</td>
                  <td className="py-2.5 px-4">Góc của điểm đầu và điểm cuối khi sử dụng chế độ vẽ hình quạt, cung... (đơn vị: độ).</td>
                </tr>

                {/* Polygon & Star */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td rowSpan={4} className="py-3 px-4 font-semibold text-amber-700 dark:text-amber-400 bg-amber-50/40 dark:bg-amber-950/20 border-r border-slate-200 dark:border-slate-800 align-top">
                    Hình đa giác, hình sao
                  </td>
                  <td className="py-2 px-4 font-mono font-bold text-slate-900 dark:text-white">Corners</td>
                  <td className="py-2 px-4">Số đỉnh của đa giác hoặc số cánh của hình sao.</td>
                </tr>
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-2 px-4 font-mono font-bold text-red-600 dark:text-red-400">Rounded</td>
                  <td className="py-2 px-4">Độ cong tại các đỉnh của hình.</td>
                </tr>
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-2 px-4 font-mono font-bold text-slate-900 dark:text-white">Spoke ratio</td>
                  <td className="py-2 px-4">Tỉ lệ bán kính từ tâm đến góc trong và từ tâm tới đỉnh đầu hình sao.</td>
                </tr>
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-2 px-4 font-mono font-bold text-slate-900 dark:text-white">Randomized</td>
                  <td className="py-2 px-4">Tham số làm méo hình ngẫu nhiên.</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile Card-Based View (Optimized for 375px - 430px screens) */}
          <div className="sm:hidden space-y-3">
            <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-xl space-y-2">
              <span className="font-bold text-xs text-blue-700 dark:text-blue-400">1. Hình vuông & Chữ nhật</span>
              <div className="text-xs space-y-1">
                <div><strong className="font-mono text-slate-900 dark:text-white">W, H:</strong> Chiều rộng, chiều dài.</div>
                <div><strong className="font-mono text-slate-900 dark:text-white">Rx, Ry:</strong> Bán kính góc bo (bằng 0 là góc vuông).</div>
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-xl space-y-2">
              <span className="font-bold text-xs text-emerald-700 dark:text-emerald-400">2. Hình tròn & Elip</span>
              <div className="text-xs space-y-1">
                <div><strong className="font-mono text-slate-900 dark:text-white">Rx, Ry:</strong> Bán kính phương ngang & đứng.</div>
                <div><strong className="font-mono text-slate-900 dark:text-white">Start, End:</strong> Góc điểm đầu & cuối (°), tạo hình quạt miếng dưa hấu.</div>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl space-y-2">
              <span className="font-bold text-xs text-amber-700 dark:text-amber-400">3. Đa giác & Ngôi sao</span>
              <div className="text-xs space-y-1">
                <div><strong className="font-mono text-slate-900 dark:text-white">Corners:</strong> Số đỉnh hoặc số cánh sao.</div>
                <div><strong className="font-mono text-red-600 dark:text-red-400">Rounded:</strong> Độ cong tại đỉnh (làm tròn cánh sao).</div>
                <div><strong className="font-mono text-slate-900 dark:text-white">Spoke ratio:</strong> Tỉ lệ bán kính trong / ngoài.</div>
                <div><strong className="font-mono text-slate-900 dark:text-white">Randomized:</strong> Tham số làm méo hình ngẫu nhiên.</div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl text-xs text-amber-900 dark:text-amber-300">
            <strong>Ghi nhớ trọng tâm:</strong> Ta có thể thay đổi thuộc tính của mỗi đối tượng được tạo từ công cụ có sẵn trên thanh điều khiển thuộc tính hoặc kéo trực tiếp các điểm neo (node handles) trên hình vẽ.
          </div>
        </div>

        {/* Right: Embedded Textbook Scan Viewer (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-inner">
            <img
              src={selectedScan === 1 ? '/public/assets/aistudio/bai13_1_b64d6d72.png' : '/public/assets/aistudio/bai13_2_c74c164a.png'}
              alt={`SGK Tin học 10 Bài 13 - Trang ${selectedScan === 1 ? '69' : '70'}`}
              className="w-full h-[360px] object-cover object-top hover:object-bottom transition-all duration-700 cursor-pointer"
              onClick={() => setShowFullImage(true)}
            />
            <div
              onClick={() => setShowFullImage(true)}
              className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer gap-2 text-white font-medium text-xs backdrop-blur-xs"
            >
              <ZoomIn className="w-4 h-4" />
              <span>Phóng to xem đầy đủ</span>
            </div>
            <div className="absolute bottom-2 right-2 px-2.5 py-1 bg-black/75 rounded text-[11px] text-white">
              Trang {selectedScan === 1 ? '69' : '70'} (Rê chuột để cuộn xem)
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            Nguồn ảnh: Sách giáo khoa Tin học 10 - Kết nối tri thức với cuộc sống (NXB Giáo dục Việt Nam)
          </p>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {showFullImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setShowFullImage(false)}
        >
          <div
            className="relative max-w-4xl max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
              <span className="font-bold text-slate-900 dark:text-white">
                Trang {selectedScan === 1 ? '69' : '70'} · Sách Giáo Khoa Tin Học 10 Bài 13
              </span>
              <button
                onClick={() => setShowFullImage(false)}
                className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 text-xs font-semibold"
              >
                Đóng [✕]
              </button>
            </div>
            <img
              src={selectedScan === 1 ? '/public/assets/aistudio/bai13_1_b64d6d72.png' : '/public/assets/aistudio/bai13_2_c74c164a.png'}
              alt="Scan SGK"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};
