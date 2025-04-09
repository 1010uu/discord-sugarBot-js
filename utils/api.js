const fetch = require("node-fetch");
const { apiUrl } = require("../config.json");

async function callApi(endpoint, data) {
  const url = `${apiUrl}/${endpoint}`; // API 서버 URL 동적으로 설정

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`서버 응답 오류: ${response.status}`);
    }

    console.log(`✅ API 요청 성공: ${url}`);
    return await response.json();
  } catch (error) {
    console.error(`❌ API 호출 실패 (${url}):`, error);
    return null;
  }
}

module.exports = { callApi };
