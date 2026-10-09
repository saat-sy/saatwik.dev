"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Single registration point. Client components import GSAP from here so plugins
// are registered once and tree-shaking keeps unused ones out.
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin, ScrambleTextPlugin, DrawSVGPlugin);

export { gsap, ScrollTrigger, useGSAP };
