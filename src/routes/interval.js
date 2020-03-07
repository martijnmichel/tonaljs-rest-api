import { Router } from "express";
//import _ from "lodash";
import { Tonal } from "@tonaljs/modules";

const router = Router();

router.get("/", (req, res) => {
  return res.send(Object.values(req.context.models.chords));
});

router.get("/:root/:interval", (req, res) => {
  return res.send(Tonal.transpose(req.params.root, req.params.interval));
});

router.get("/:interval", (req, res) => {
  return res.send(Tonal.interval(req.params.interval));
});
export default router;
