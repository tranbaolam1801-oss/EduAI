import { appConfig } from "../config/app-config.js";

const backendStatusNode = document.querySelector("#backend-status");
const aiStatusNode = document.querySelector("#ai-status");

const setStatus = (element, text, tone) => {
  element.textContent = text;
  element.dataset.tone = tone;
};

const checkService = async (url, element, onlineText) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    setStatus(element, onlineText, "online");
  } catch (_error) {
    setStatus(element, "Chưa kết nối", "offline");
  }
};

checkService(`${appConfig.backendBaseUrl}/system/health`, backendStatusNode, "Đang hoạt động");
checkService(`${appConfig.aiServiceBaseUrl}/system/health`, aiStatusNode, "Đang hoạt động");
