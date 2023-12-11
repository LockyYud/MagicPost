// "use client";
// import "@/css/test.css";
// import { useState } from "react";
// import { useEffect } from "react";
// import { useAnimate, stagger } from "framer-motion";
// import { Menu } from "@/components/employee/sidebar/menu";
// import { MenuToggle } from "@/components/employee/sidebar/menutoggle";
// import { motion } from "framer-motion";
// import { getgetData } from "@/api/data";
// function useMenuAnimation(isOpen) {
//   const [scope, animate] = useAnimate();

//   useEffect(() => {
//     const menuAnimations = isOpen
//       ? [
//           [
//             "nav",
//             { transform: "translateX(0%)" },
//             { ease: [0.08, 0.65, 0.53, 0.96], duration: 0.6 },
//           ],
//           ["#togle-zone", { transform: "translateX(0%)" }, { at: "<" }],
//           // // [
//           //   "li",
//           //   { transform: "scale(1)", opacity: 1, filter: "blur(0px)" },
//           //   { delay: stagger(0.05), at: "-0.1" },
//           // ],
//         ]
//       : [
//           // [
//           //   "li",
//           //   { transform: "scale(0.5)", opacity: 0, filter: "blur(10px)" },
//           //   { delay: stagger(0.05, { from: "last" }), at: "<" },
//           // ],
//           ["nav", { transform: "translateX(-100%)" }, { at: "-0.1" }],
//           ["#togle-zone", { transform: "translateX(-400px)" }, { at: "<" }],
//         ];

//     animate([
//       [
//         "path.top",
//         { d: isOpen ? "M 3 16.5 L 17 2.5" : "M 2 2.5 L 20 2.5" },
//         { at: "<" },
//       ],
//       ["path.middle", { opacity: isOpen ? 0 : 1 }, { at: "<" }],
//       [
//         "path.bottom",
//         { d: isOpen ? "M 3 2.5 L 17 16.346" : "M 2 16.346 L 20 16.346" },
//         { at: "<" },
//       ],
//       ...menuAnimations,
//     ]);
//   }, [isOpen]);

//   return scope;
// }

// export default function App() {
//   const [isOpen, setIsOpen] = useState(false);

//   const scope = useMenuAnimation(isOpen);
//   const data = getgetData();
//   return (
//     <motion.div layout>
//       <motion.div ref={scope} id="main">
//         <Menu />
//         <MenuToggle toggle={() => setIsOpen(!isOpen)} />
//         <motion.div layout id="content" data-isOpen={isOpen}></motion.div>
//       </motion.div>
//     </motion.div>
//   );
// }
"use client";
import useSWR from "swr";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { login } from "@/api/action";
import { headers } from "../../../next.config";
import { getEmployee, getgetData, testSWR } from "@/api/definations";
import { getData } from "@/api/data";

export default function page() {
  // const url = "https://magicpost-uet.onrender.com/api/employee/get";
  // const data = getgetData(url);
  // const { data: session, status: isLoading } = useSession();
  // console.log("check token: ", session?.accessToken);
  const data = getData("https://magicpost-uet.onrender.com/api/order/getall");
  console.log(data);
  return (
    <>
      <h1>Protected Page</h1>
      <p>You can view this page because you are signed in.</p>
    </>
  );
}
