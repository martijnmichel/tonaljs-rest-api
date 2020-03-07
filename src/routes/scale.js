import { Router } from "express";
import _ from "lodash";
import { Scale } from "@tonaljs/modules";

const router = Router();

router.get("/", (req, res) => {
  return res.send(Object.values(req.context.models.chords));
});

router.get("/:root/:scaleName", (req, res) => {
  return res.send(Scale.scale(`${req.params.root} ${req.params.scaleName}`));
});

router.get("/:scaleName", (req, res) => {
  let scale = _.find(
    req.context.models.scales,
    c => c.name === req.params.scaleName
  );
  if (scale) return res.send(scale);
  else
    return res.send({
      empty: true
    });
});
export default router;
