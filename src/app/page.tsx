"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import ASCIIText from "../components/ASCIIText";
import CountdownTimer from "@/components/CountdownTimer";

export default function Home() {
  const [hasClicked, sethasClicked] = useState(false);
  const [powerButtonFontSize, setPowerButtonFontSize] = useState(200);

  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstScreenRef = useRef<HTMLDivElement>(null);
  const secondScreenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setPowerButtonFontSize(window.innerWidth <= 768 ? 100 : 200);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const runTransitionAnimation = () => {
    if (
      !firstScreenRef.current ||
      !secondScreenRef.current ||
      !imageWrapperRef.current ||
      !buttonRef.current
    ) {
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        // Update state only after all animations are complete
        sethasClicked(true);
      },
    });

    tl.to(buttonRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
    })
      .set(
        imageWrapperRef.current,
        {
          clipPath: "circle(0% at 50% 50%)",
          opacity: 1,
        },
        "-=0.5"
      )
      .to(imageWrapperRef.current, {
        clipPath: "circle(75% at 50% 50%)",
        duration: 1.5,
        ease: "power2.out",
      })
      .to(
        imageWrapperRef.current,
        {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out",
        },
        "-=0.3"
      );

    tl.to(
      firstScreenRef.current,
      {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
          if (firstScreenRef.current) {
            firstScreenRef.current.style.display = "none";
          }
        },
      },
      "-=0.5"
    )
      .set(secondScreenRef.current, {
        display: "flex",
        opacity: 0,
      })
      .to(
        secondScreenRef.current,
        {
          opacity: 1,
          duration: 1,
          ease: "power2.inOut",
        },
        "<0.5"
      );
  };

  const handleClick = () => {
    // Prevent multiple clicks during the animation
    if (hasClicked) return;
    runTransitionAnimation();
  };

  return (
    <main className="min-h-[100svh] relative flex items-center justify-center overflow-hidden bg-black">
      {/* 1. Both screens are now always in the DOM during the transition */}
      <div
        ref={firstScreenRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="absolute top-0 left-0 w-screen h-screen z-10">
          <Image
            src="/homeBg3.png"
            alt="Fullscreen Background"
            fill
            className="object-fill"
            priority
          />
        </div>
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <button
            ref={buttonRef}
            className="w-1/2 h-screen text-center flex items-center justify-center relative z-20"
            onClick={handleClick}
          >
            <ASCIIText
              text="⏻"
              enableWaves={false}
              asciiFontSize={8}
              textFontSize={powerButtonFontSize}
            />
          </button>

          <div
            ref={imageWrapperRef}
            className="absolute z-30 w-full h-full"
            style={{ opacity: 0, clipPath: "circle(0% at 50% 50%)" }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src="/technoVit.svg"
                alt="Techno VIT Logo"
                fill
                className="object-contain scale-80"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        ref={secondScreenRef}
        className="absolute inset-0 hidden flex-col items-center justify-center"
      >
        <div className="absolute top-0 left-0 w-screen h-screen z-10">
          <Image
            src="/homeBg3.png"
            alt="Fullscreen Background"
            fill
            className="object-fill"
            priority
          />
          
        </div>
          
        <div className="relative z-10 w-[90%] max-w-6xl aspect-[4/3] flex items-center justify-center max-h-[85vh]">
          <Image
            src="/technoVit-CRT.png"
            alt="CRT Frame"
            fill
            className="object-contain"
          />
          <Image
            src="/date.png"
            alt="Date"
            className="object-contain"
            width={1200}
            height={600}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-between p-4 md:p-8">
            <div className="flex justify-between items-center w-full -mt-3 px-2 sm:px-4">
              <div className="relative w-[25%] sm:w-[20%] md:w-[15%] scale-150">
                <Image
                  src="/vitLogoWhite.png"
                  alt="VIT Logo"
                  layout="responsive"
                  width={120}
                  height={60}
                />
              </div>
              <div className="relative w-[40%] sm:w-[30%] md:w-[25%] scale-150">
                <Image
                  src="/technoVit.svg"
                  alt="TechnoVIT Logo"
                  layout="responsive"
                  width={180}
                  height={70}
                />
              </div>
            </div>
            <div className="flex flex-col items-center mt-[12vh] sm:mt-[32vh]">
              <CountdownTimer targetDate="2025-10-31T00:00:00" />
            </div>
            <div className="flex justify-center items-center gap-4 sm:gap-20 md:gap-24 w-full mt-[-4vh] sm:mt-[-8vh]">
              <a
                href="https://www.instagram.com/technovit_25/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-[25vw] sm:w-40 transform transition-transform hover:scale-110"
              >
                <Image
                  src="/insta.png"
                  alt="Instagram"
                  layout="responsive"
                  width={300}
                  height={300}
                />
              </a>
              <a
                href="mailto:technovit@vit.ac.in"
                className="w-[36vw] sm:w-52 mt-3 sm:mt-6 transform transition-transform hover:scale-110"
              >
                <Image
                  src="/mail.png"
                  alt="Email"
                  layout="responsive"
                  width={500}
                  height={500}
                />
              </a>
              <a
                href="https://www.linkedin.com/company/technovit-chennai/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-[25vw] sm:w-40 transform transition-transform hover:scale-110"
              >
                <Image
                  src="/linkedin.png"
                  alt="LinkedIn"
                  layout="responsive"
                  width={300}
                  height={300}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
