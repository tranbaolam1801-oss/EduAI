String getDifficultyLabel(String? value) {
  switch (value) {
    case 'BASIC':
      return 'Cơ bản';
    case 'INTERMEDIATE':
      return 'Trung bình';
    case 'ADVANCED':
      return 'Nâng cao';
    default:
      return 'Chưa rõ';
  }
}

String getResourceTypeLabel(String? value) {
  switch (value) {
    case 'COURSE':
      return 'Khóa học';
    case 'VIDEO':
      return 'Video';
    case 'BOOK':
      return 'Sách';
    case 'ARTICLE':
      return 'Bài viết';
    case 'EXERCISE':
      return 'Bài tập';
    case 'PROJECT':
      return 'Dự án';
    case 'PODCAST':
      return 'Podcast';
    default:
      return 'Tài liệu';
  }
}

String getTaskTypeLabel(String? value) {
  switch (value) {
    case 'LESSON':
      return 'Bài học';
    case 'PRACTICE':
      return 'Luyện tập';
    case 'QUIZ':
      return 'Quiz';
    case 'PROJECT':
      return 'Dự án';
    case 'REVIEW':
      return 'Ôn tập';
    default:
      return 'Nhiệm vụ';
  }
}

String getTaskStatusLabel(String? value) {
  switch (value) {
    case 'NOT_STARTED':
      return 'Chưa bắt đầu';
    case 'IN_PROGRESS':
      return 'Đang học';
    case 'COMPLETED':
      return 'Hoàn thành';
    case 'SKIPPED':
      return 'Bỏ qua';
    default:
      return 'Chưa rõ';
  }
}

String getQuizAttemptStatusLabel(String? value) {
  switch (value) {
    case 'IN_PROGRESS':
      return 'Đang làm';
    case 'SUBMITTED':
      return 'Đã nộp';
    case 'GRADED':
      return 'Đã chấm';
    default:
      return 'Chưa rõ';
  }
}
