"use client";

import Link from "next/link";
import { Globe } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const Footer = () => {
  const path = usePathname();
  const hiddenpath = path === "/signin" || path === "/signup" || path.startsWith("/admin");
  if (hiddenpath) return null;
  
  return (
    <footer className="bg-[#0A0A0A] text-white px-6 md:px-10 py-18">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-sm">
        {/* Column 1 - Help */}
        <div>
          <motion.h4
            className="font-semibold mb-4 tracking-wide text-[#D4AF37]"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
          >
            HELP
          </motion.h4>
          <ul className="space-y-2">
            <motion.li variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
              You can{" "}
              <Link href="/call" className="underline hover:text-[#D4AF37]">
                call
              </Link>{" "}
              or{" "}
              <Link href="/email" className="underline hover:text-[#D4AF37]">
                email us
              </Link>
              .
            </motion.li>
            <motion.li variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}>
              <Link href="/faqs" className="hover:text-[#D4AF37]">
                FAQ’s
              </Link>
            </motion.li>
            <motion.li variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3}>
              <Link href="/product-care" className="hover:text-[#D4AF37]">
                Product Care
              </Link>
            </motion.li>
            <motion.li variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={4}>
              <Link href="/stores" className="hover:text-[#D4AF37]">
                Stores
              </Link>
            </motion.li>
          </ul>
        </div>

        {/* Column 2 - Services */}
        <div>
          <motion.h4
            className="font-semibold mb-4 tracking-wide text-[#D4AF37]"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={5}
          >
            SERVICES
          </motion.h4>
          <ul className="space-y-2">
            {["repairs", "personalization", "gifting", "apps"].map((item, i) => (
              <motion.li
                key={item}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={6 + i}
              >
                <Link href={`/${item}`} className="hover:text-[#D4AF37] capitalize">
                  {item.replace("-", " ")}
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Column 3 - About */}
        <div>
          <motion.h4
            className="font-semibold mb-4 tracking-wide text-[#D4AF37]"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={10}
          >
            ABOUT XAVIQUE
          </motion.h4>
          <ul className="space-y-2">
            {[
              "fashion-shows",
              "arts",
              "la-maison",
              "sustainability",
              "news",
              "careers",
              "foundation",
            ].map((item, i) => (
              <motion.li
                key={item}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={11 + i}
              >
                <Link href={`/${item}`} className="hover:text-[#D4AF37] capitalize">
                  {item.replace("-", " ")}
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Column 4 - Email Sign-up */}
        <div>
          <motion.h4
            className="font-semibold mb-4 tracking-wide text-[#D4AF37]"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={20}
          >
            EMAIL SIGN-UP
          </motion.h4>
          <motion.p
            className="mb-4"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={21}
          >
            <Link href="/signup" className="underline hover:text-[#D4AF37]">
              Sign up
            </Link>{" "}
            for Xavique emails and receive the latest news, exclusive pre-launches, and collections.
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={22}
          >
            <Link href="/follow-us" className="hover:text-[#D4AF37]">
              Follow Us
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/70">
        <motion.div
          className="flex items-center space-x-2"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={23}
        >
          <Globe size={14} />
          <Link href="#" className="underline hover:text-[#D4AF37]">
            International (English)
          </Link>
        </motion.div>
        <motion.div
          className="mt-4 md:mt-0 space-x-6"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={24}
        >
          <Link href="/sitemap" className="hover:text-[#D4AF37]">
            Sitemap
          </Link>
          <Link href="/legal" className="hover:text-[#D4AF37]">
            Legal & Privacy
          </Link>
          <Link href="/cookies" className="hover:text-[#D4AF37]">
            Cookies
          </Link>
        </motion.div>
      </div>

      {/* Logo */}
      <motion.div
        className="text-center mt-8 text-lg font-semibold tracking-widest text-white"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={25}
      >
        <img src="/xavique.png" alt="Xavique Logo" className="w-32 mx-auto" />
      </motion.div>
    </footer>
  );
};

export default Footer;
