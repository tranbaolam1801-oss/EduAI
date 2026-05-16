import {
  getChallengeDetail,
  joinChallenge,
  listChallenges,
  listMyChallenges
} from "../../services/challenges/challengeService.js";
import { sendSuccess } from "../../utils/http/apiResponse.js";

export const getChallengeList = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy danh sách thử thách thành công.",
    data: await listChallenges(req.auth.user_id, {
      limit: req.query.limit ? Number(req.query.limit) : 20,
      status: req.query.status || null
    })
  });

export const getChallengeById = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy chi tiết thử thách thành công.",
    data: await getChallengeDetail(Number(req.params.id), req.auth.user_id)
  });

export const joinChallengeById = async (req, res) =>
  sendSuccess(res, {
    statusCode: 201,
    message: "Tham gia thử thách thành công.",
    data: await joinChallenge(Number(req.params.id), req.auth.user_id)
  });

export const getMyChallengeList = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy danh sách thử thách đã tham gia thành công.",
    data: await listMyChallenges(req.auth.user_id)
  });
