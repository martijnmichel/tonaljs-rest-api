import { Router } from "express";
import _ from "lodash";
import { Chord } from "@tonaljs/modules";

const router = Router();

router.get("/", (req, res) => {
  return res.send(Object.values(req.context.models.chords));
});

router.get("/:root/:chordAlias", (req, res) => {
  return res.send(Chord.chord(`${req.params.root}${req.params.chordAlias}`));
});

router.get("/:chordAlias", (req, res) => {
  let chord = _.find(req.context.models.chords, c =>
    c.aliases.includes(req.params.chordAlias)
  );
  if (chord) return res.send(chord);
  else
    return res.send({
      empty: true
    });
});
export default router;
