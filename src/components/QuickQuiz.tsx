import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Award, RotateCcw } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  source: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'Nếu trên hình vẽ có sẵn một hình sao 5 cánh nhọn, em cần thay đổi tham số nào để các đỉnh ngôi sao trở nên cong?',
    source: 'Câu hỏi SGK Tin học 10 (Trang 70)',
    options: ['Corners', 'Rounded', 'Spoke ratio', 'Randomized'],
    correctAnswer: 1,
    explanation: 'Chính xác! Theo bảng SGK trang 70, thuộc tính "Rounded" là độ cong tại các đỉnh của hình, giúp làm tròn các đỉnh ngôi sao nhọn thành hoa hoặc cánh tròn mềm mại.'
  },
  {
    id: 2,
    question: 'Khi vẽ hình chữ nhật hoặc hình vuông trong Inkscape, nếu bán kính góc bo Rx = 0 và Ry = 0 thì hình sẽ có đặc điểm gì?',
    source: 'Bảng thuộc tính SGK (Trang 69)',
    options: [
      'Góc của hình là góc vuông nhọn',
      'Góc của hình bị bo tròn tối đa',
      'Hình biến thành hình elip',
      'Hình không hiển thị'
    ],
    correctAnswer: 0,
    explanation: 'Chính xác! SGK trang 69 ghi rõ: "Rx, Ry: Bán kính của góc bo (bằng 0 nếu góc của hình là góc vuông)".'
  },
  {
    id: 3,
    question: 'Để vẽ miếng dưa hấu nhiều lớp ở Hình 13.1, ta vẽ từ công cụ hình tròn/elip rồi chỉnh 2 thuộc tính nào để tạo hình quạt bán nguyệt?',
    source: 'Hoạt động đầu bài 13 (Trang 69)',
    options: [
      'W và H',
      'Corners và Rounded',
      'Start và End',
      'Spoke ratio và Randomized'
    ],
    correctAnswer: 2,
    explanation: 'Chính xác! Thuộc tính Start và End quy định góc của điểm đầu và điểm cuối để tạo hình quạt hoặc cung tròn, tạo nên miếng dưa hấu bán nguyệt.'
  },
  {
    id: 4,
    question: 'Thuộc tính Spoke ratio của hình sao có ý nghĩa gì?',
    source: 'Bảng thuộc tính đa giác & sao (Trang 70)',
    options: [
      'Số cánh của hình sao',
      'Tham số làm méo hình ngẫu nhiên',
      'Tỉ lệ bán kính từ tâm đến góc trong và từ tâm tới đỉnh đầu hình sao',
      'Độ dày viền vẽ'
    ],
    correctAnswer: 2,
    explanation: 'Chính xác! Spoke ratio là tỉ lệ bán kính tâm - góc trong so với tâm - đỉnh đầu hình sao, quyết định cánh sao thon nhọn hay phẳng.'
  }
];

export const QuickQuiz: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);

  const currentQ = QUESTIONS[currentIdx];
  const isAnswered = selectedAnswers[currentIdx] !== undefined;
  const isCorrect = isAnswered && selectedAnswers[currentIdx] === currentQ.correctAnswer;

  const handleSelect = (optionIdx: number) => {
    if (isAnswered) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIdx]: optionIdx }));
  };

  const handleNext = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setShowResult(false);
  };

  const totalCorrect = Object.entries(selectedAnswers).filter(
    ([qIdx, ans]) => QUESTIONS[Number(qIdx)].correctAnswer === ans
  ).length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            <HelpCircle className="w-4 h-4" />
            <span>Trắc Nghiệm Nhanh Củng Cố Kiến Thức (SGK)</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Kiểm tra hiểu biết sau video 45 giây
          </h3>
        </div>

        <span className="text-xs font-mono px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
          Câu {currentIdx + 1}/{QUESTIONS.length}
        </span>
      </div>

      {!showResult ? (
        <div className="mt-6 max-w-2xl">
          <div className="mb-2 text-xs text-slate-500 font-medium">{currentQ.source}</div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-5 leading-relaxed">
            {currentQ.question}
          </h4>

          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              const isOptionSelected = selectedAnswers[currentIdx] === idx;
              let style = 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100';

              if (isAnswered) {
                if (idx === currentQ.correctAnswer) {
                  style = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-300 font-semibold';
                } else if (isOptionSelected) {
                  style = 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-900 dark:text-red-300';
                } else {
                  style = 'opacity-40 border-slate-200 dark:border-slate-800 text-slate-500';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between ${style}`}
                >
                  <span>{opt}</span>
                  {isAnswered && idx === currentQ.correctAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isAnswered && isOptionSelected && idx !== currentQ.correctAnswer && (
                    <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation box after answer */}
          {isAnswered && (
            <div className={`mt-5 p-4 rounded-xl border text-xs leading-relaxed ${
              isCorrect
                ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
                : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300'
            }`}>
              <strong>{isCorrect ? 'Tuyệt vời!' : 'Lưu ý:'}</strong> {currentQ.explanation}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isAnswered
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow hover:opacity-90'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              {currentIdx === QUESTIONS.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo →'}
            </button>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-950/50 text-purple-600 rounded-full flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-slate-900 dark:text-white">
            Bạn đã hoàn thành trắc nghiệm!
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Kết quả: <span className="font-bold text-purple-600 dark:text-purple-400 text-base">{totalCorrect}/{QUESTIONS.length}</span> câu trả lời đúng ({Math.round((totalCorrect / QUESTIONS.length) * 100)}%).
          </p>
          <div className="pt-2">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Làm lại trắc nghiệm</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
