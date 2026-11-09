export interface Scene {
  id: number;
  startTime: number; // in seconds
  endTime: number; // in seconds
  title: string;
  badge: string;
  subtitle: string;
  script: string;
  keyProperties: { name: string; meaning: string; icon?: string }[];
  accentColor: string;
}

export const SCENES: Scene[] = [
  {
    id: 1,
    startTime: 0,
    endTime: 7.5,
    badge: "Bài 13 - Tin học 10",
    title: "Các đối tượng hình khối trong Inkscape",
    subtitle: "Khám phá các công cụ tạo hình đồ hoạ vector cơ bản",
    script: "Chào mừng các bạn đến với Bài 13: Bổ sung các đối tượng đồ họa trong Inkscape! Hộp công cụ Inkscape cung cấp sẵn các hình khối cơ bản: Hình chữ nhật, hình vuông, hình tròn, elip, đa giác và ngôi sao.",
    keyProperties: [
      { name: "Công cụ R", meaning: "Hình chữ nhật & Hình vuông" },
      { name: "Công cụ E", meaning: "Hình tròn, Elip & Vòng cung" },
      { name: "Công cụ *", meaning: "Hình đa giác & Ngôi sao" }
    ],
    accentColor: "#0284c7"
  },
  {
    id: 2,
    startTime: 7.5,
    endTime: 19.0,
    badge: "Nhóm 1 · Hình chữ nhật & Vuông",
    title: "Thuộc tính W, H và Bán kính góc bo Rx, Ry",
    subtitle: "W, H: Kích thước chiều dài, rộng | Rx, Ry: Bo tròn góc",
    script: "Nhóm thứ nhất là hình chữ nhật và hình vuông. W và H là chiều rộng và chiều dài. Thuộc tính Rx và Ry là bán kính của góc bo: khi bằng 0 là góc vuông, tăng lên sẽ tạo các góc bo tròn mềm mại.",
    keyProperties: [
      { name: "W, H", meaning: "Chiều rộng, chiều dài (Width, Height)" },
      { name: "Rx, Ry", meaning: "Bán kính góc bo tròn (bằng 0 nếu góc vuông)" }
    ],
    accentColor: "#2563eb"
  },
  {
    id: 3,
    startTime: 19.0,
    endTime: 31.0,
    badge: "Nhóm 2 · Hình tròn & Elip",
    title: "Bán kính Rx, Ry & Góc Start, End tạo hình quạt",
    subtitle: "Tạo hình quạt, cung tròn và ứng dụng vẽ miếng dưa hấu (Hình 13.1)",
    script: "Nhóm thứ hai là hình tròn và elip. Rx và Ry là bán kính theo phương ngang và thẳng đứng. Thuộc tính Start và End là góc điểm đầu và điểm cuối tính bằng độ, giúp tạo hình quạt và miếng dưa hấu sinh động!",
    keyProperties: [
      { name: "Rx, Ry", meaning: "Bán kính theo phương ngang và thẳng đứng" },
      { name: "Start, End", meaning: "Góc điểm đầu và điểm cuối (tạo hình quạt, cung)" }
    ],
    accentColor: "#059669"
  },
  {
    id: 4,
    startTime: 31.0,
    endTime: 41.5,
    badge: "Nhóm 3 · Đa giác & Ngôi sao",
    title: "Corners, Rounded, Spoke ratio & Randomized",
    subtitle: "Biến đổi ngôi sao nhọn thành hoa cánh cong (Hình 13.2 SGK)",
    script: "Nhóm thứ ba là hình đa giác và ngôi sao. Corners là số đỉnh; Spoke ratio chỉnh độ sâu cánh sao; Rounded làm bo cong đỉnh biến sao thành hoa; và Randomized tạo độ méo ngẫu nhiên nghệ thuật.",
    keyProperties: [
      { name: "Corners", meaning: "Số đỉnh đa giác hoặc số cánh hình sao" },
      { name: "Rounded", meaning: "Độ cong tại các đỉnh (làm tròn cánh sao)" },
      { name: "Spoke ratio", meaning: "Tỉ lệ bán kính từ tâm đến góc trong và đỉnh" },
      { name: "Randomized", meaning: "Tham số làm méo hình ngẫu nhiên" }
    ],
    accentColor: "#d97706"
  },
  {
    id: 5,
    startTime: 41.5,
    endTime: 45.0,
    badge: "Tổng kết & Thực hành",
    title: "Làm chủ đối tượng hình khối trong Inkscape",
    subtitle: "Sẵn sàng sáng tạo mọi tác phẩm đồ hoạ vector tuyệt đẹp",
    script: "Nắm vững các thuộc tính hình khối cơ bản này, các em hoàn toàn làm chủ Inkscape để sáng tạo mọi tác phẩm vector độc đáo. Chúc các em học tập thật tốt!",
    keyProperties: [
      { name: "Inkscape 10", meaning: "Kiến thức trọng tâm Bài 13" },
      { name: "Ứng dụng", meaning: "Ghép lớp và biến đổi hình linh hoạt" }
    ],
    accentColor: "#7c3aed"
  }
];

export const TOTAL_DURATION = 45.0; // 45 seconds exact
