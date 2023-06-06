/**
 * allwinedu 법정교육 자동 수강 프로그램
 * @version 1.0.0
 * @author https://github.com/dokdo2013
 *
 * [사용방법]
 * 1. allwinedu.net에 로그인
 * 2. 개발자 도구(F12)를 열고 콘솔(Console) 탭으로 이동
 * 3. 아래 코드 중 user_id와 lecture_items를 필요에 맞게 수정
 * 3-1. user_id는 로그인한 ID (이름+생일) ex. 홍길동0123
 * 3-2. lecture_items는 강의 목록 (필요한 강의만 남겨두고 나머지는 지워서 쓰세요)
 * 4. 콘솔에 복사 붙여넣기 후 엔터
 *
 * [주의사항]
 * 이 프로그램을 사용함으로써 발생하는 모든 문제의 책임은 사용자 본인에게 있습니다.
 * 사용자는 이 프로그램을 사용함으로써 발생하는 모든 문제에 대해 제작자에게 책임을 묻지 않습니다.
 *
 * [참고]
 * 1. lecture_items.time 값은 수강해야하는 "남은 시간"입니다. 중간부터 수강하려면 시간을 수정해주세요.
 * 2. 코드 실행을 멈추려면 콘솔을 새로고침하면 됩니다.
 * 3. 강의를 수강하면서 다른 작업을 하면 안됩니다. (콘솔을 닫으면 안됩니다.)
 * 4. 만일 스크립트로 실행하려면 쿠키값을 직접 넣어줘야합니다. (user_session)
 * 4-1. 쿠키값은 로그인 후 개발자 도구(F12) Script 탭에 들어가서 document.cookie.split('; ').find((s)=>s.includes('ASPSESSIONID')) 를 실행하면 나옵니다.
 */

const user_id = ""; // 로그인한 ID (이름+생일) ex. 홍길동0123
const lecture_items = [
  // 강의 목록 (필요한 강의만 남겨두고 나머지는 지워서 쓰세요)
  {
    id: 3114867, // 퇴직연금 가입자교육_v3
    time: 3609.230625, // 시간 1:00:09
  },
  {
    id: 3114835, // 직장 내 괴롭힘 예방교육_v3
    time: 3604.367438, // 시간 1:00:04
  },
  {
    id: 3114803, // 장애인 인식개선 교육_v4
    time: 3600.063133, // 시간 1:00:00
  },
  {
    id: 3114771, // 개인정보보호교육_v4
    time: 3610.0064, // 시간 1:00:10
  },
  {
    id: 3114739, // 성희롱 예방교육_v4
    time: 3602.9994, // 시간 1:00:02
  },
];

const user_session = document.cookie
  .split("; ")
  .find((s) => s.includes("ASPSESSIONID")); // 로그인한 세션 (스크립트로 실행하려면 쿠키값을 직접 넣어줘야함)

// 진도 기록
const action = async (session, lecture) => {
  const myHeaders = new Headers();
  myHeaders.append("Cookie", session);
  myHeaders.append(
    "Referer",
    `https://allwinedu.net/view/my_study/study.asp?idx=${lecture.id}&chapter=1`
  );
  myHeaders.append("Origin", "https://allwinedu.net");
  myHeaders.append(
    "User-Agent",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36"
  );
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  var urlencoded = new URLSearchParams();
  urlencoded.append("idx", lecture.id);
  urlencoded.append("chapter", "1");
  urlencoded.append("slideNum", "1");
  urlencoded.append("slideUrl", "1");
  urlencoded.append("slideCount", lecture.time);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };

  await fetch(
    "https://allwinedu.net/app/api/study/chapter_jindo.asp",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
};

// 강의 init
const init = async (session, lecture, entry_id) => {
  const myHeaders = new Headers();
  myHeaders.append("Cookie", session);
  myHeaders.append(
    "Referer",
    `https://allwinedu.net/view/my_study/study.asp?idx=${lecture.id}&chapter=1`
  );
  myHeaders.append("Origin", "https://allwinedu.net");
  myHeaders.append(
    "User-Agent",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36"
  );
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  var urlencoded = new URLSearchParams();
  urlencoded.append("idx", lecture.id);
  urlencoded.append("chapter", "1");
  urlencoded.append("entry_id", entry_id);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };

  await fetch(
    "https://allwinedu.net/app/study/chapter_jindo_init.asp",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
};

// 메인
const main = async () => {
  console.log("시작!");
  for (const lecture of lecture_items) {
    console.log(lecture.id + " 강의 시작");
    await init(user_session, lecture, user_id);
    const interval = parseInt(lecture.time / 20) + 1;
    for (let i = 0; i < interval; i++) {
      await action(user_session, lecture);
      console.log(lecture.id + " 강의 진행중 " + (i + 1) + "/" + interval);
    }
    console.log(lecture.id + " 강의 종료");
  }
  console.log("완료!");
};

// 실행
main();
