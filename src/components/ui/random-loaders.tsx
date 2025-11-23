import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Blackhole Loader Component (Separate - No Astronaut)
const BlackholeLoader = () => {
  return (
    <div className="blackhole-loader-wrapper">
      {/* Animated Stars */}
      <div className="box-of-star1">
        <div className="star star-position1"></div>
        <div className="star star-position2"></div>
        <div className="star star-position3"></div>
        <div className="star star-position4"></div>
        <div className="star star-position5"></div>
        <div className="star star-position6"></div>
        <div className="star star-position7"></div>
      </div>
      <div className="box-of-star2">
        <div className="star star-position1"></div>
        <div className="star star-position2"></div>
        <div className="star star-position3"></div>
        <div className="star star-position4"></div>
        <div className="star star-position5"></div>
        <div className="star star-position6"></div>
        <div className="star star-position7"></div>
      </div>
      <div className="box-of-star3">
        <div className="star star-position1"></div>
        <div className="star star-position2"></div>
        <div className="star star-position3"></div>
        <div className="star star-position4"></div>
        <div className="star star-position5"></div>
        <div className="star star-position6"></div>
        <div className="star star-position7"></div>
      </div>
      <div className="box-of-star4">
        <div className="star star-position1"></div>
        <div className="star star-position2"></div>
        <div className="star star-position3"></div>
        <div className="star star-position4"></div>
        <div className="star star-position5"></div>
        <div className="star star-position6"></div>
        <div className="star star-position7"></div>
      </div>

      {/* Blackhole Only */}
      <div className="blackhole-loader">
        <div className="blackhole">
          <div className="blackhole-circle"></div>
          <div className="blackhole-disc"></div>
        </div>

        <div className="curve">
          <svg viewBox="0 0 500 500">
            <path id="loading" d="M73.2,148.6c4-6.1,65.5-96.8,178.6-95.6c111.3,1.2,170.8,90.3,175.1,97"></path>
            <text width="500">
              <textPath xlinkHref="#loading">
                loading...
              </textPath>
            </text>
          </svg>
        </div>
      </div>

      <style>{`
        .blackhole-loader-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
        }

        /* Stars Animation */
        @keyframes snow {
          0% {
            opacity: 0;
            transform: translateY(0px);
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: translateY(650px);
          }
        }

        @keyframes astronaut {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .box-of-star1,
        .box-of-star2,
        .box-of-star3,
        .box-of-star4 {
          width: 100%;
          position: absolute;
          z-index: 1;
          left: 0;
          top: 0;
          transform: translateY(0px);
          height: 100vh;
        }

        .box-of-star1 {
          animation: snow 5s linear infinite;
        }

        .box-of-star2 {
          animation: snow 5s -1.64s linear infinite;
        }

        .box-of-star3 {
          animation: snow 5s -2.30s linear infinite;
        }

        .box-of-star4 {
          animation: snow 5s -3.30s linear infinite;
        }

        .star {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background-color: #FFF;
          position: absolute;
          z-index: 1;
          opacity: 0.7;
        }

        .star:before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #FFF;
          position: absolute;
          z-index: 1;
          top: 80px;
          left: 70px;
          opacity: .7;
        }

        .star:after {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #FFF;
          position: absolute;
          z-index: 1;
          top: 8px;
          left: 170px;
          opacity: .9;
        }

        .star-position1 {
          top: 30px;
          left: 20%;
        }

        .star-position2 {
          top: 110px;
          left: 35%;
        }

        .star-position3 {
          top: 60px;
          left: 55%;
        }

        .star-position4 {
          top: 120px;
          left: 70%;
        }

        .star-position5 {
          top: 20px;
          left: 80%;
        }

        .star-position6 {
          top: 90px;
          left: 90%;
        }

        .star-position7 {
          top: 30px;
          left: 10%;
        }

        /* Astronaut Styles */
        .astronaut {
          width: 250px;
          height: 300px;
          position: absolute;
          z-index: 2;
          top: calc(50% - 150px);
          left: calc(50% - 125px);
          animation: astronaut 5s linear infinite;
        }

        .schoolbag {
          width: 100px;
          height: 150px;
          position: absolute;
          z-index: 1;
          top: calc(50% - 75px);
          left: calc(50% - 50px);
          background-color: #94b7ca;
          border-radius: 50px 50px 0 0 / 30px 30px 0 0;
        }

        .head {
          width: 97px;
          height: 80px;
          position: absolute;
          z-index: 3;
          background: linear-gradient(to right, #e3e8eb 0%, #e3e8eb 50%, #fbfdfa 50%, #fbfdfa 100%);
          border-radius: 50%;
          top: 34px;
          left: calc(50% - 47.5px);
        }

        .head:after {
          content: "";
          width: 60px;
          height: 50px;
          position: absolute;
          top: calc(50% - 25px);
          left: calc(50% - 30px);
          background: linear-gradient(to bottom, #15aece 0%, #15aece 50%, #0391bf 50%, #0391bf 100%);
          border-radius: 15px;
        }

        .head:before {
          content: "";
          width: 12px;
          height: 25px;
          position: absolute;
          top: calc(50% - 12.5px);
          left: -4px;
          background-color: #618095;
          border-radius: 5px;
          box-shadow: 92px 0px 0px #618095;
        }

        .body {
          width: 85px;
          height: 100px;
          position: absolute;
          z-index: 2;
          background-color: #fffbff;
          border-radius: 40px / 20px;
          top: 105px;
          left: calc(50% - 41px);
          background: linear-gradient(to right, #e3e8eb 0%, #e3e8eb 50%, #fbfdfa 50%, #fbfdfa 100%);
        }

        .panel {
          width: 60px;
          height: 40px;
          position: absolute;
          top: 20px;
          left: calc(50% - 30px);
          background-color: #b7cceb;
        }

        .panel:before {
          content: "";
          width: 30px;
          height: 5px;
          position: absolute;
          top: 9px;
          left: 7px;
          background-color: #fbfdfa;
          box-shadow: 0px 9px 0px #fbfdfa, 0px 18px 0px #fbfdfa;
        }

        .panel:after {
          content: "";
          width: 8px;
          height: 8px;
          position: absolute;
          top: 9px;
          right: 7px;
          background-color: #fbfdfa;
          border-radius: 50%;
          box-shadow: 0px 14px 0px 2px #fbfdfa;
        }

        .arm {
          width: 80px;
          height: 30px;
          position: absolute;
          top: 121px;
          z-index: 2;
        }

        .arm-left {
          left: 30px;
          background-color: #e3e8eb;
          border-radius: 0 0 0 39px;
        }

        .arm-right {
          right: 30px;
          background-color: #fbfdfa;
          border-radius: 0 0 39px 0;
        }

        .arm-left:before,
        .arm-right:before {
          content: "";
          width: 30px;
          height: 70px;
          position: absolute;
          top: -40px;
        }

        .arm-left:before {
          border-radius: 50px 50px 0px 120px / 50px 50px 0 110px;
          left: 0;
          background-color: #e3e8eb;
        }

        .arm-right:before {
          border-radius: 50px 50px 120px 0 / 50px 50px 110px 0;
          right: 0;
          background-color: #fbfdfa;
        }

        .arm-left:after,
        .arm-right:after {
          content: "";
          width: 30px;
          height: 10px;
          position: absolute;
          top: -24px;
        }

        .arm-left:after {
          background-color: #6e91a4;
          left: 0;
        }

        .arm-right:after {
          right: 0;
          background-color: #b6d2e0;
        }

        .leg {
          width: 30px;
          height: 40px;
          position: absolute;
          z-index: 2;
          bottom: 70px;
        }

        .leg-left {
          left: 76px;
          background-color: #e3e8eb;
          transform: rotate(20deg);
        }

        .leg-right {
          right: 73px;
          background-color: #fbfdfa;
          transform: rotate(-20deg);
        }

        .leg-left:before,
        .leg-right:before {
          content: "";
          width: 50px;
          height: 25px;
          position: absolute;
          bottom: -26px;
        }

        .leg-left:before {
          left: -20px;
          background-color: #e3e8eb;
          border-radius: 30px 0 0 0;
          border-bottom: 10px solid #6d96ac;
        }

        .leg-right:before {
          right: -20px;
          background-color: #fbfdfa;
          border-radius: 0 30px 0 0;
          border-bottom: 10px solid #b0cfe4;
        }

        /* Blackhole styles */
        .blackhole-loader {
          display: flex;
          width: 8rem;
          height: 8rem;
          justify-content: center;
          align-items: center;
          position: relative;
          flex-direction: column;
          z-index: 10;
        }

        .curve {
          width: 180%;
          height: 180%;
          position: absolute;
          animation: rotate 8s linear infinite;
          fill: transparent;
        }

        .curve text {
          letter-spacing: 20px;
          text-transform: uppercase;
          font: 1.5em "Fira Sans", sans-serif;
          fill: #ffffff;
          filter: drop-shadow(0 2px 8px rgba(255,255,255,0.5));
        }

        .blackhole {
          z-index: 10;
          display: flex;
          position: absolute;
          width: 8rem;
          height: 8rem;
          align-items: center;
          justify-content: center;
        }

        .blackhole-circle {
          z-index: 10;
          display: flex;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(circle at center, #000000 25%, #1a1a1a 45%, #4a4a4a 70%, #8a8a8a 100%);
          box-shadow: 0px 0px 2rem rgba(255,255,255,0.3), inset 0px 0px 2rem rgba(0,0,0,0.8);
          align-items: center;
          justify-content: center;
        }

        .blackhole-circle::after {
          z-index: 10;
          position: absolute;
          content: "";
          display: flex;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 3px solid rgba(255,255,255,0.2);
          background: radial-gradient(circle at center, transparent 35%, rgba(100,100,100,0.3) 60%, rgba(150,150,150,0.5) 100%);
          box-shadow: 0px 0px 4rem rgba(255,255,255,0.2);
          align-items: center;
          justify-content: center;
          filter: blur(3px);
          animation: pulseAnimation linear infinite 2s alternate-reverse;
        }

        .blackhole-circle::before {
          z-index: 11;
          content: "";
          display: flex;
          width: 4rem;
          height: 4rem;
          border: 2px solid rgba(255,255,255,0.3);
          box-shadow: 3px 3px 10px rgba(255,255,255,0.2), inset 0 0 1rem rgba(255,255,255,0.1);
          border-radius: 50%;
          top: 5rem;
          filter: blur(0.5px);
          animation: rotate linear infinite 3s;
        }

        .blackhole-disc {
          position: absolute;
          z-index: 9;
          display: flex;
          width: 5rem;
          height: 10rem;
          border-radius: 50%;
          background: radial-gradient(circle at center, rgba(200,200,200,0.6) 60%, rgba(100,100,100,0.4) 80%, rgba(50,50,50,0.2) 100%);
          filter: blur(1rem) brightness(130%);
          border: 1rem solid rgba(150,150,150,0.3);
          box-shadow: 0px 0px 3rem rgba(255,255,255,0.2);
          transform: rotate3d(1, 1, 1, 220deg);
          animation: pulseAnimation2 linear infinite 2s alternate-reverse;
          justify-content: center;
          align-items: center;
        }

        .blackhole-disc::before {
          content: "";
          position: absolute;
          z-index: 8;
          display: flex;
          width: 5rem;
          height: 10rem;
          border-radius: 50%;
          background: radial-gradient(circle at center, rgba(200,200,200,0.5) 70%, rgba(100,100,100,0.3) 85%, rgba(50,50,50,0.1) 100%);
          filter: blur(3rem);
          border: 1rem solid rgba(150,150,150,0.2);
          box-shadow: 0px 0px 6rem rgba(255,255,255,0.15);
          animation: pulseAnimation linear infinite 2s alternate-reverse;
        }

        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulseAnimation {
          0% {
            box-shadow: 0px 0px 3rem rgba(255,255,255,0.2);
            transform: scale(1);
          }
          100% {
            box-shadow: 0px 0px 5rem rgba(255,255,255,0.3);
            transform: scale(1.09);
          }
        }

        @keyframes pulseAnimation2 {
          0% {
            box-shadow: 0px 0px 3rem rgba(255,255,255,0.2);
            transform: rotate3d(1, 1, 1, 220deg) scale(1);
          }
          100% {
            box-shadow: 0px 0px 5rem rgba(255,255,255,0.3);
            transform: rotate3d(1, 1, 1, 220deg) scale(.95);
          }
        }
      `}</style>
    </div>
  );
};

// Astronaut Floating Loader
const AstronautLoader = () => {
  return (
    <div className="astronaut-loader-wrapper">
      {/* Stars Background - 4 layers */}
      <div className="box-of-star1">
        <div className="star star-position1"></div>
        <div className="star star-position2"></div>
        <div className="star star-position3"></div>
        <div className="star star-position4"></div>
        <div className="star star-position5"></div>
        <div className="star star-position6"></div>
        <div className="star star-position7"></div>
      </div>
      <div className="box-of-star2">
        <div className="star star-position1"></div>
        <div className="star star-position2"></div>
        <div className="star star-position3"></div>
        <div className="star star-position4"></div>
        <div className="star star-position5"></div>
        <div className="star star-position6"></div>
        <div className="star star-position7"></div>
      </div>
      <div className="box-of-star3">
        <div className="star star-position1"></div>
        <div className="star star-position2"></div>
        <div className="star star-position3"></div>
        <div className="star star-position4"></div>
        <div className="star star-position5"></div>
        <div className="star star-position6"></div>
        <div className="star star-position7"></div>
      </div>
      <div className="box-of-star4">
        <div className="star star-position1"></div>
        <div className="star star-position2"></div>
        <div className="star star-position3"></div>
        <div className="star star-position4"></div>
        <div className="star star-position5"></div>
        <div className="star star-position6"></div>
        <div className="star star-position7"></div>
      </div>
      
      {/* Rotating Astronaut */}
      <div data-js="astro" className="astronaut">
        <div className="head"></div>
        <div className="arm arm-left"></div>
        <div className="arm arm-right"></div>
        <div className="body">
          <div className="panel"></div>
        </div>
        <div className="leg leg-left"></div>
        <div className="leg leg-right"></div>
        <div className="schoolbag"></div>
      </div>

      <style>{`
        .astronaut-loader-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          width: 100vw;
          background: radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%);
          overflow: hidden;
          position: relative;
        }

        /* Stars Animation */
        @keyframes snow {
          0% {
            opacity: 0;
            transform: translateY(0px);
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: translateY(650px);
          }
        }

        @keyframes astronaut {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .box-of-star1,
        .box-of-star2,
        .box-of-star3,
        .box-of-star4 {
          width: 100%;
          position: absolute;
          z-index: 10;
          left: 0;
          top: 0;
          transform: translateY(0px);
          height: 700px;
        }

        .box-of-star1 {
          animation: snow 5s linear infinite;
        }

        .box-of-star2 {
          animation: snow 5s -1.64s linear infinite;
        }

        .box-of-star3 {
          animation: snow 5s -2.30s linear infinite;
        }

        .box-of-star4 {
          animation: snow 5s -3.30s linear infinite;
        }

        .star {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background-color: #FFF;
          position: absolute;
          z-index: 10;
          opacity: 0.7;
        }

        .star:before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #FFF;
          position: absolute;
          z-index: 10;
          top: 80px;
          left: 70px;
          opacity: .7;
        }

        .star:after {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #FFF;
          position: absolute;
          z-index: 10;
          top: 8px;
          left: 170px;
          opacity: .9;
        }

        .star-position1 {
          top: 30px;
          left: 20px;
        }

        .star-position2 {
          top: 110px;
          left: 250px;
        }

        .star-position3 {
          top: 60px;
          left: 570px;
        }

        .star-position4 {
          top: 120px;
          left: 900px;
        }

        .star-position5 {
          top: 20px;
          left: 1120px;
        }

        .star-position6 {
          top: 90px;
          left: 1280px;
        }

        .star-position7 {
          top: 30px;
          left: 1480px;
        }

        /* Astronaut Styles */
        .astronaut {
          width: 250px;
          height: 300px;
          position: absolute;
          z-index: 11;
          top: calc(50% - 150px);
          left: calc(50% - 125px);
          animation: astronaut 5s linear infinite;
        }

        .schoolbag {
          width: 100px;
          height: 150px;
          position: absolute;
          z-index: 1;
          top: calc(50% - 75px);
          left: calc(50% - 50px);
          background-color: #94b7ca;
          border-radius: 50px 50px 0 0 / 30px 30px 0 0;
        }

        .head {
          width: 97px;
          height: 80px;
          position: absolute;
          z-index: 3;
          background: -webkit-linear-gradient(left, #e3e8eb 0%, #e3e8eb 50%, #fbfdfa 50%, #fbfdfa 100%);
          border-radius: 50%;
          top: 34px;
          left: calc(50% - 47.5px);
        }

        .head:after {
          content: "";
          width: 60px;
          height: 50px;
          position: absolute;
          top: calc(50% - 25px);
          left: calc(50% - 30px);
          background: -webkit-linear-gradient(top, #15aece 0%, #15aece 50%, #0391bf 50%, #0391bf 100%);
          border-radius: 15px;
        }

        .head:before {
          content: "";
          width: 12px;
          height: 25px;
          position: absolute;
          top: calc(50% - 12.5px);
          left: -4px;
          background-color: #618095;
          border-radius: 5px;
          box-shadow: 92px 0px 0px #618095;
        }

        .body {
          width: 85px;
          height: 100px;
          position: absolute;
          z-index: 2;
          background-color: #fffbff;
          border-radius: 40px / 20px;
          top: 105px;
          left: calc(50% - 41px);
          background: -webkit-linear-gradient(left, #e3e8eb 0%, #e3e8eb 50%, #fbfdfa 50%, #fbfdfa 100%);
        }

        .panel {
          width: 60px;
          height: 40px;
          position: absolute;
          top: 20px;
          left: calc(50% - 30px);
          background-color: #b7cceb;
        }

        .panel:before {
          content: "";
          width: 30px;
          height: 5px;
          position: absolute;
          top: 9px;
          left: 7px;
          background-color: #fbfdfa;
          box-shadow: 0px 9px 0px #fbfdfa, 0px 18px 0px #fbfdfa;
        }

        .panel:after {
          content: "";
          width: 8px;
          height: 8px;
          position: absolute;
          top: 9px;
          right: 7px;
          background-color: #fbfdfa;
          border-radius: 50%;
          box-shadow: 0px 14px 0px 2px #fbfdfa;
        }

        .arm {
          width: 80px;
          height: 30px;
          position: absolute;
          top: 121px;
          z-index: 2;
        }

        .arm-left {
          left: 30px;
          background-color: #e3e8eb;
          border-radius: 0 0 0 39px;
        }

        .arm-right {
          right: 30px;
          background-color: #fbfdfa;
          border-radius: 0 0 39px 0;
        }

        .arm-left:before,
        .arm-right:before {
          content: "";
          width: 30px;
          height: 70px;
          position: absolute;
          top: -40px;
        }

        .arm-left:before {
          border-radius: 50px 50px 0px 120px / 50px 50px 0 110px;
          left: 0;
          background-color: #e3e8eb;
        }

        .arm-right:before {
          border-radius: 50px 50px 120px 0 / 50px 50px 110px 0;
          right: 0;
          background-color: #fbfdfa;
        }

        .arm-left:after,
        .arm-right:after {
          content: "";
          width: 30px;
          height: 10px;
          position: absolute;
          top: -24px;
        }

        .arm-left:after {
          background-color: #6e91a4;
          left: 0;
        }

        .arm-right:after {
          right: 0;
          background-color: #b6d2e0;
        }

        .leg {
          width: 30px;
          height: 40px;
          position: absolute;
          z-index: 2;
          bottom: 70px;
        }

        .leg-left {
          left: 76px;
          background-color: #e3e8eb;
          transform: rotate(20deg);
        }

        .leg-right {
          right: 73px;
          background-color: #fbfdfa;
          transform: rotate(-20deg);
        }

        .leg-left:before,
        .leg-right:before {
          content: "";
          width: 50px;
          height: 25px;
          position: absolute;
          bottom: -26px;
        }

        .leg-left:before {
          left: -20px;
          background-color: #e3e8eb;
          border-radius: 30px 0 0 0;
          border-bottom: 10px solid #6d96ac;
        }

        .leg-right:before {
          right: -20px;
          background-color: #fbfdfa;
          border-radius: 0 30px 0 0;
          border-bottom: 10px solid #b0cfe4;
        }
      `}</style>
    </div>
  );
};

// Recording Laptop Loader with Audio
const RecordingLoader = () => {
  useEffect(() => {
    // Play audio when this loader mounts
    const audio = new Audio('/loaders/loader.mp3');
    audio.volume = 0.5;
    audio.loop = true;
    audio.play().catch(err => console.log('Audio play failed:', err));

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return (
    <div className="recording-loader-wrapper">
      <div className="recording-loader">
        <div className="ph1">
          <div className="record"></div>
          <div className="record-text">REC</div>
        </div>
        <div className="ph2">
          <div className="laptop-b"></div>
          <svg className="laptop-t" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 30">
            <path
              d="M21 1H5C2.78 1 1 2.78 1 5V25a4 4 90 004 4H37a4 4 90 004-4V5c0-2.22-1.8-4-4-4H21"
              pathLength="100"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
            ></path>
          </svg>
        </div>
        <div className="icon"></div>
      </div>

      <style>{`
        .recording-loader-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
        }

        .recording-loader {
          --c: #f7971d;
          position: relative;
          width: 300px;
          height: 300px;
        }

        .ph1 {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
          animation: ph1 3s ease infinite;
          animation-delay: 0.5s;
          clip-path: polygon(-4em -1em, 4em -1em, 4em 1em, -4em 1em);
        }

        .record {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 2em;
          height: 2em;
          background: var(--c);
          border-radius: 999px;
          animation: blink 1s step-end infinite;
          animation-delay: 0.5s;
          transform: translate(-3.5em, -50%);
        }

        .record-text {
          position: absolute;
          color: var(--c);
          font-size: 2.2em;
          font-weight: 700;
          left: 50%;
          top: 50%;
          transform: translate(-0.5em, -50%);
          width: 2em;
          height: 1.5em;
        }

        @keyframes blink {
          50% { opacity: 0; }
          75% { opacity: 1; }
        }

        @keyframes ph1 {
          25.5% {
            translate: 0 0;
            clip-path: polygon(-4em -1em, 4em -1em, 4em 1em, -4em 1em);
          }
          30%, to {
            opacity: 1;
            translate: 0 3em;
            clip-path: polygon(-4em 1em, 4em 1em, 4em 1em, -4em 1em);
          }
          30.1% {
            opacity: 0;
            translate: 0 3em;
          }
          92.4%, to {
            translate: 0 0;
            opacity: 0;
            clip-path: polygon(-4em -1em, 4em -1em, 4em 1em, -4em 1em);
          }
          92.5% {
            opacity: 1;
            clip-path: polygon(-4em -1em, -0.5em -1em, -0.5em 1em, -4em 1em);
          }
          to {
            opacity: 1;
            clip-path: polygon(-4em -1em, 4em -1em, 4em 1em, -4em 1em);
          }
        }

        .ph2 {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -4em);
          width: 11em;
          height: 7em;
          perspective: 150px;
          perspective-origin: 50% 0%;
          transform-style: preserve-3d;
          animation: ph2 3s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        @keyframes ph2 {
          0%, 15% { translate: 0 4em; }
          0%, 29% { opacity: 0; }
          30% { opacity: 1; }
          40% { translate: 0 0; }
          50% {
            translate: 0 0.5em;
            opacity: 1;
          }
          50.1%, to { opacity: 0; }
        }

        .laptop-b {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 0.5em;
          background: var(--c);
          border-bottom-left-radius: 2em;
          border-bottom-right-radius: 2em;
          animation: ph2b 3s ease infinite;
          animation-delay: 0.5s;
        }

        .laptop-t {
          margin: 0 1.25em;
          color: var(--c);
          transform-origin: 50% 100%;
          animation: ph2t 3s ease infinite;
          animation-delay: 0.5s;
        }

        @keyframes ph2t {
          0%, 29% { transform: rotateX(-10deg); }
          0%, 41.9% { stroke-dasharray: unset; }
          42% {
            transform: rotateX(4deg);
            stroke-dasharray: 0 0 100;
          }
          50% {
            transform: rotateX(-20deg);
            stroke-dasharray: 0 50 0 100;
          }
        }

        @keyframes ph2b {
          42% { scale: 1 1; }
          50% { scale: 0 1; }
        }

        .icon {
          position: absolute;
          width: 4em;
          height: 4em;
          background: var(--c);
          border-radius: 999px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          transform-origin: center;
          animation: icon 3s ease-in-out infinite;
          isolation: isolate;
          border-color: var(--c);
          border-style: solid;
          z-index: -1;
        }

        @keyframes icon {
          0%, 15% {
            translate: 0 4.5em;
            width: 0;
            height: 0;
          }
          0%, 29% { opacity: 0; }
          30% { opacity: 1; }
          40% {
            translate: 0 -0.75em;
            width: 4em;
            height: 4em;
          }
          50% {
            translate: 0 0em;
            opacity: 1;
            background: var(--c);
          }
          50.1% {
            border-width: 2em;
            background: black;
          }
          65% {
            width: 4em;
            height: 4em;
            transform: translate(-50%, -50%);
            border-width: 4px;
          }
          80%, to {
            width: 2em;
            height: 2em;
            translate: 0 0;
            transform: translate(-3.5em, -50%);
            border-width: 1em;
            background: black;
          }
          80.1%, to { background: var(--c); }
          84.9% { opacity: 1; }
          85%, to { opacity: 0; }
        }

        .icon::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          border: 0.8em solid black;
          box-sizing: border-box;
          border-left-color: transparent !important;
          border-bottom-color: transparent !important;
          transform: translate(-50%, 2.5em) rotate(-45deg);
          transform-origin: center;
          animation: iconb 3s ease-in-out infinite;
          z-index: -1;
        }

        @keyframes iconb {
          20% { transform: translate(-50%, 2.5em) rotate(-45deg); }
          50% {
            transform: translate(-50%, -25%) rotate(-45deg);
            border-color: black;
          }
          65%, to {
            transform: translateY(0) scale(1) scaleX(1.5) translate(-60%, -50%) rotate(45deg);
            border-color: var(--c);
          }
          85%, to {
            transform: translate(-40%, -50%) scale(0) scaleX(1.5) translate(-75%, -50%) rotate(45deg);
          }
        }

        .icon::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          background: black;
          width: 1em;
          height: 2em;
          box-sizing: border-box;
          border-left-color: transparent;
          border-bottom-color: transparent;
          animation: icona 3s ease-in-out infinite;
        }

        @keyframes icona {
          20% { transform: translate(-50%, 2.5em); }
          50% { transform: translate(-50%, 0.4em); }
          65%, to { transform: translate(-50%, 2.5em); }
        }
      `}</style>
    </div>
  );
};

// Bicycle Loader
const BicycleLoader = () => {
  return (
    <div className="bicycle-loader-wrapper">
      <svg className="bicycle-loader" viewBox="0 0 48 30" width="150px" height="94px">
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1">
          <g transform="translate(9.5,19)">
            <circle className="loader_tire" r="9" strokeDasharray="56.549 56.549"></circle>
            <g className="loader_spokes-spin" strokeDasharray="31.416 31.416" strokeDashoffset="-23.562">
              <circle className="loader_spokes" r="5"></circle>
              <circle className="loader_spokes" r="5" transform="rotate(180,0,0)"></circle>
            </g>
          </g>
          <g transform="translate(24,19)">
            <g className="loader_pedals-spin" strokeDasharray="25.133 25.133" strokeDashoffset="-21.991" transform="rotate(67.5,0,0)">
              <circle className="loader_pedals" r="4"></circle>
              <circle className="loader_pedals" r="4" transform="rotate(180,0,0)"></circle>
            </g>
          </g>
          <g transform="translate(38.5,19)">
            <circle className="loader_tire" r="9" strokeDasharray="56.549 56.549"></circle>
            <g className="loader_spokes-spin" strokeDasharray="31.416 31.416" strokeDashoffset="-23.562">
              <circle className="loader_spokes" r="5"></circle>
              <circle className="loader_spokes" r="5" transform="rotate(180,0,0)"></circle>
            </g>
          </g>
          <polyline className="loader_seat" points="14 3,18 3" strokeDasharray="5 5"></polyline>
          <polyline className="loader_body" points="16 3,24 19,9.5 19,18 8,34 7,24 19" strokeDasharray="79 79"></polyline>
          <path className="loader_handlebars" d="m30,2h6s1,0,1,1-1,1-1,1" strokeDasharray="10 10"></path>
          <polyline className="loader_front" points="32.5 2,38.5 19" strokeDasharray="19 19"></polyline>
        </g>
      </svg>

      <style>{`
        .bicycle-loader-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
        }

        .bicycle-loader {
          display: block;
          width: 150px;
          height: auto;
        }

        .loader_body,
        .loader_front,
        .loader_handlebars,
        .loader_pedals,
        .loader_pedals-spin,
        .loader_seat,
        .loader_spokes,
        .loader_spokes-spin,
        .loader_tire {
          animation: bikeBody 3s ease-in-out infinite;
          stroke: #ffffff;
          transition: stroke 0.3s;
        }

        .loader_front { animation-name: bikeFront; }
        .loader_handlebars { animation-name: bikeHandlebars; }
        .loader_pedals { animation-name: bikePedals; }
        .loader_pedals-spin { animation-name: bikePedalsSpin; }
        .loader_seat { animation-name: bikeSeat; }
        .loader_spokes { animation-name: bikeSpokes; }
        .loader_spokes-spin { animation-name: bikeSpokesSpin; }
        .loader_tire { animation-name: bikeTire; }

        @keyframes bikeBody {
          from { stroke-dashoffset: 79; }
          33%, 67% { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -79; }
        }

        @keyframes bikeFront {
          from { stroke-dashoffset: 19; }
          33%, 67% { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -19; }
        }

        @keyframes bikeHandlebars {
          from { stroke-dashoffset: 10; }
          33%, 67% { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -10; }
        }

        @keyframes bikePedals {
          from {
            animation-timing-function: ease-in;
            stroke-dashoffset: -25.133;
          }
          33%, 67% {
            animation-timing-function: ease-out;
            stroke-dashoffset: -21.991;
          }
          to { stroke-dashoffset: -25.133; }
        }

        @keyframes bikePedalsSpin {
          from { transform: rotate(0.1875turn); }
          to { transform: rotate(3.1875turn); }
        }

        @keyframes bikeSeat {
          from { stroke-dashoffset: 5; }
          33%, 67% { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -5; }
        }

        @keyframes bikeSpokes {
          from {
            animation-timing-function: ease-in;
            stroke-dashoffset: -31.416;
          }
          33%, 67% {
            animation-timing-function: ease-out;
            stroke-dashoffset: -23.562;
          }
          to { stroke-dashoffset: -31.416; }
        }

        @keyframes bikeSpokesSpin {
          from { transform: rotate(0); }
          to { transform: rotate(3turn); }
        }

        @keyframes bikeTire {
          from {
            animation-timing-function: ease-in;
            stroke-dashoffset: 56.549;
            transform: rotate(0);
          }
          33% {
            stroke-dashoffset: 0;
            transform: rotate(0.33turn);
          }
          67% {
            animation-timing-function: ease-out;
            stroke-dashoffset: 0;
            transform: rotate(0.67turn);
          }
          to {
            stroke-dashoffset: -56.549;
            transform: rotate(1turn);
          }
        }
      `}</style>
    </div>
  );
};

// 3D Cube Loader
const CubeLoader = () => {
  return (
    <div className="cube-loader-wrapper">
      <div className="cube-loader">
        <div className="cube">
          <div className="face middle front">
            <div className="cube cube-front">
              <div className="face front"></div>
              <div className="face back"></div>
              <div className="face left"></div>
              <div className="face right"></div>
              <div className="face top"></div>
              <div className="face bottom"></div>
            </div>
          </div>
          <div className="face middle back">
            <div className="cube cube-back">
              <div className="face front"></div>
              <div className="face back"></div>
              <div className="face left"></div>
              <div className="face right"></div>
              <div className="face top"></div>
              <div className="face bottom"></div>
            </div>
          </div>
          <div className="face middle left">
            <div className="cube cube-left">
              <div className="face front"></div>
              <div className="face back"></div>
              <div className="face left"></div>
              <div className="face right"></div>
              <div className="face top"></div>
              <div className="face bottom"></div>
            </div>
          </div>
          <div className="face middle right">
            <div className="cube cube-right">
              <div className="face front"></div>
              <div className="face back"></div>
              <div className="face left"></div>
              <div className="face right"></div>
              <div className="face top"></div>
              <div className="face bottom"></div>
            </div>
          </div>
          <div className="face middle top">
            <div className="cube cube-top">
              <div className="face front"></div>
              <div className="face back"></div>
              <div className="face left"></div>
              <div className="face right"></div>
              <div className="face top"></div>
              <div className="face bottom"></div>
            </div>
          </div>
          <div className="face middle bottom">
            <div className="cube cube-bottom">
              <div className="face front"></div>
              <div className="face back"></div>
              <div className="face left"></div>
              <div className="face right"></div>
              <div className="face top"></div>
              <div className="face bottom"></div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cube-loader-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
        }

        .cube-loader {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cube {
          position: absolute;
          width: 40px;
          transform-style: preserve-3d;
          transform: rotateX(-30deg) rotateY(45deg);
          transition: 300ms ease;
          cursor: pointer;
          animation: rotateCube 10s infinite linear;
        }

        .cube-front, .cube-back {
          transform: translateX(40px) translateZ(-20px);
          animation: none;
        }

        .cube-top, .cube-bottom {
          transform: translateZ(20px);
          animation: none;
        }

        .cube-left, .cube-right {
          transform: translateX(40px) translateZ(-20px);
          animation: none;
        }

        .face {
          position: absolute;
          transform-style: preserve-3d;
          width: 40px;
          height: 40px;
          background: rgb(21, 46, 75);
          background: radial-gradient(circle, rgba(21, 46, 75, 1) 0%, rgba(10, 14, 55, 1) 100%);
        }

        .front { transform: rotateY(0deg) translateZ(20px); }
        .back { transform: rotateY(180deg) translateZ(20px); }
        .left { transform: rotateY(-90deg) translateZ(20px); }
        .right { transform: rotateY(90deg) translateZ(20px); }
        .top { transform: rotateX(90deg) translateZ(20px); }
        .bottom { transform: rotateX(-90deg) translateZ(20px); }

        .cube-back:hover .face,
        .cube-front:hover .face,
        .cube-top:hover .face,
        .cube-bottom:hover .face,
        .cube-left:hover .face,
        .cube-right:hover .face {
          background: rgb(255, 255, 255);
          background: radial-gradient(circle, white 60%, rgb(157, 208, 255) 100%);
          filter: drop-shadow(0px 0px 5px #e7faff) drop-shadow(0px 0px 15px rgb(75, 168, 255)) drop-shadow(0px 0px 30px rgb(50, 156, 255));
        }

        .middle {
          background: transparent;
        }

        @keyframes rotateCube {
          0% { transform: rotateX(-30deg) rotateY(45deg); }
          100% { transform: rotateX(-30deg) rotateY(405deg); }
        }
      `}</style>
    </div>
  );
};

// Walking Character Loader
const WalkingCharacterLoader = () => {
  return (
    <div className="walking-loader-wrapper">
      {/* Stars Background */}
      <div className="box-of-star1">
        <div className="star star-position1"></div>
        <div className="star star-position2"></div>
        <div className="star star-position3"></div>
        <div className="star star-position4"></div>
        <div className="star star-position5"></div>
        <div className="star star-position6"></div>
        <div className="star star-position7"></div>
      </div>
      <div className="box-of-star2">
        <div className="star star-position1"></div>
        <div className="star star-position2"></div>
        <div className="star star-position3"></div>
        <div className="star star-position4"></div>
        <div className="star star-position5"></div>
        <div className="star star-position6"></div>
        <div className="star star-position7"></div>
      </div>
      <div className="box-of-star3">
        <div className="star star-position1"></div>
        <div className="star star-position2"></div>
        <div className="star star-position3"></div>
        <div className="star star-position4"></div>
        <div className="star star-position5"></div>
        <div className="star star-position6"></div>
        <div className="star star-position7"></div>
      </div>
      <div className="box-of-star4">
        <div className="star star-position1"></div>
        <div className="star star-position2"></div>
        <div className="star star-position3"></div>
        <div className="star star-position4"></div>
        <div className="star star-position5"></div>
        <div className="star star-position6"></div>
        <div className="star star-position7"></div>
      </div>
      
      <div className="loader walking-loader">
        <svg
          className="legl"
          version="1.1"
          width="20.69332"
          height="68.19944"
          viewBox="0,0,20.69332,68.19944"
        >
          <g transform="translate(-201.44063,-235.75466)">
            <g strokeMiterlimit="10">
              <path d="" fill="#ffffff" stroke="none" strokeWidth="0.5"></path>
              <path
                d=""
                fillOpacity="0.26667"
                fill="#97affd"
                strokeOpacity="0.48627"
                stroke="#ffffff"
                strokeWidth="0"
              ></path>
              <path
                d="M218.11971,301.20087c-2.20708,1.73229 -4.41416,0 -4.41416,0l-1.43017,-1.1437c-1.42954,-1.40829 -3.04351,-2.54728 -4.56954,-3.87927c-0.95183,-0.8308 -2.29837,-1.49883 -2.7652,-2.55433c-0.42378,-0.95815 0.14432,-2.02654 0.29355,-3.03399c0.41251,-2.78499 1.82164,-5.43386 2.41472,-8.22683c1.25895,-4.44509 2.73863,-8.98683 3.15318,-13.54796c0.22615,-2.4883 -0.21672,-5.0155 -0.00278,-7.50605c0.30636,-3.56649 1.24602,-7.10406 1.59992,-10.6738c0.29105,-2.93579 -0.00785,-5.9806 -0.00785,-8.93046c0,0 0,-2.44982 3.12129,-2.44982c3.12129,0 3.12129,2.44982 3.12129,2.44982c0,3.06839 0.28868,6.22201 -0.00786,9.27779c-0.34637,3.56935 -1.30115,7.10906 -1.59992,10.6738c-0.2103,2.50918 0.22586,5.05326 -0.00278,7.56284c-0.43159,4.7371 -1.94029,9.46317 -3.24651,14.07835c-0.47439,2.23403 -1.29927,4.31705 -2.05805,6.47156c-0.18628,0.52896 -0.1402,1.0974 -0.327,1.62624c-0.09463,0.26791 -0.64731,0.47816 -0.50641,0.73323c0.19122,0.34617 0.86423,0.3445 1.2346,0.58502c1.88637,1.22503 3.50777,2.79494 5.03,4.28305l0.96971,0.73991c0,0 2.20708,1.73229 0,3.46457z"
                fill="none"
                stroke="#191e2e"
                strokeWidth="7"
              ></path>
            </g>
          </g>
        </svg>

        <svg
          className="legr"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="41.02537"
          height="64.85502"
          viewBox="0,0,41.02537,64.85502"
        >
          <g transform="translate(-241.54137,-218.44347)">
            <g strokeMiterlimit="10">
              <path
                d="M279.06674,279.42662c-2.27967,1.98991 -6.08116,0.58804 -6.08116,0.58804l-2.47264,-0.92915c-2.58799,-1.18826 -5.31176,-2.08831 -7.99917,-3.18902c-1.67622,-0.68654 -3.82471,-1.16116 -4.93147,-2.13229c-1.00468,-0.88156 -0.69132,-2.00318 -0.92827,-3.00935c-0.65501,-2.78142 0.12275,-5.56236 -0.287,-8.37565c-0.2181,-4.51941 -0.17458,-9.16283 -1.60696,-13.68334c-0.78143,-2.46614 -2.50162,-4.88125 -3.30086,-7.34796c-1.14452,-3.53236 -1.40387,-7.12078 -2.48433,-10.66266c-0.88858,-2.91287 -2.63779,-5.85389 -3.93351,-8.74177c0,0 -1.07608,-2.39835 3.22395,-2.81415c4.30003,-0.41581 2.41605,1.98254 2.41605,1.98254c1.34779,3.00392 3.13072,6.05282 4.06444,9.0839c1.09065,3.54049 1.33011,7.13302 2.48433,10.66266c0.81245,2.48448 2.5308,4.917 3.31813,7.40431c1.48619,4.69506 1.48366,9.52281 1.71137,14.21503c0.32776,2.25028 0.10631,4.39942 0.00736,6.60975c-0.02429,0.54266 0.28888,1.09302 0.26382,1.63563c-0.01269,0.27488 -0.68173,0.55435 -0.37558,0.78529c0.41549,0.31342 1.34191,0.22213 1.95781,0.40826c3.13684,0.94799 6.06014,2.26892 8.81088,3.52298l1.66093,0.59519c0,0 6.76155,1.40187 4.48187,3.39177z"
                fill="none"
                stroke="#000000"
                strokeWidth="7"
              ></path>
              <path d="" fill="#ffffff" stroke="none" strokeWidth="0.5"></path>
              <path
                d=""
                fillOpacity="0.26667"
                fill="#97affd"
                strokeOpacity="0.48627"
                stroke="#ffffff"
                strokeWidth="0"
              ></path>
            </g>
          </g>
        </svg>

        <div className="bod">
          <svg
            version="1.1"
            width="144.10576"
            height="144.91623"
            viewBox="0,0,144.10576,144.91623"
          >
            <g transform="translate(-164.41679,-112.94712)">
              <g strokeMiterlimit="10">
                <path
                  d="M166.9168,184.02633c0,-36.49454 35.0206,-66.07921 72.05288,-66.07921c37.03228,0 67.05288,29.58467 67.05288,66.07921c0,6.94489 -1.08716,13.63956 -3.10292,19.92772c-2.71464,8.46831 -7.1134,16.19939 -12.809,22.81158c-2.31017,2.68194 -7.54471,12.91599 -7.54471,12.91599c0,0 -5.46714,-1.18309 -8.44434,0.6266c-3.86867,2.35159 -10.95356,10.86714 -10.95356,10.86714c0,0 -6.96906,-3.20396 -9.87477,-2.58085c-2.64748,0.56773 -6.72538,5.77072 -6.72538,5.77072c0,0 -5.5023,-4.25969 -7.5982,-4.25969c-3.08622,0 -9.09924,3.48259 -9.09924,3.48259c0,0 -6.0782,-5.11244 -9.00348,-5.91884c-4.26461,-1.17561 -12.23343,0.75049 -12.23343,0.75049c0,0 -5.18164,-8.26065 -7.60688,-9.90388c-3.50443,-2.37445 -8.8271,-3.95414 -8.8271,-3.95414c0,0 -5.33472,-8.81718 -7.27019,-11.40895c-4.81099,-6.44239 -13.46422,-9.83437 -15.65729,-17.76175c-1.53558,-5.55073 -2.35527,-21.36472 -2.35527,-21.36472z"
                  fill="#191e2e"
                  stroke="#000000"
                  strokeWidth="5"
                  strokeLinecap="butt"
                ></path>
                <path
                  d="M167.94713,180c0,-37.03228 35.0206,-67.05288 72.05288,-67.05288c37.03228,0 67.05288,30.0206 67.05288,67.05288c0,7.04722 -1.08716,13.84053 -3.10292,20.22135c-2.71464,8.59309 -7.1134,16.43809 -12.809,23.14771c-2.31017,2.72146 -7.54471,13.1063 -7.54471,13.1063c0,0 -5.46714,-1.20052 -8.44434,0.63584c-3.86867,2.38624 -10.95356,11.02726 -10.95356,11.02726c0,0 -6.96906,-3.25117 -9.87477,-2.61888c-2.64748,0.5761 -6.72538,5.85575 -6.72538,5.85575c0,0 -5.5023,-4.32246 -7.5982,-4.32246c-3.08622,0 -9.09924,3.5339 -9.09924,3.5339c0,0 -6.0782,-5.18777 -9.00348,-6.00605c-4.26461,-1.19293 -12.23343,0.76155 -12.23343,0.76155c0,0 -5.18164,-8.38236 -7.60688,-10.04981c-3.50443,-2.40943 -8.8271,-4.0124 -8.8271,-4.0124c0,0 -5.33472,-8.9471 -7.27019,-11.57706c-4.81099,-6.53732 -13.46422,-9.97928 -15.65729,-18.02347c-1.53558,-5.63252 -2.35527,-21.67953 -2.35527,-21.67953z"
                  fill="#191e2e"
                  stroke="none"
                  strokeWidth="0"
                  strokeLinecap="butt"
                ></path>
                <path
                  d=""
                  fill="#ffffff"
                  stroke="none"
                  strokeWidth="0.5"
                  strokeLinecap="butt"
                ></path>
                <path
                  d=""
                  fillOpacity="0.26667"
                  fill="#97affd"
                  strokeOpacity="0.48627"
                  stroke="#ffffff"
                  strokeWidth="0"
                  strokeLinecap="butt"
                ></path>
                <path
                  d="M216.22445,188.06994c0,0 1.02834,11.73245 -3.62335,21.11235c-4.65169,9.3799 -13.06183,10.03776 -13.06183,10.03776c0,0 7.0703,-3.03121 10.89231,-10.7381c4.34839,-8.76831 5.79288,-20.41201 5.79288,-20.41201z"
                  fill="none"
                  stroke="#2f3a50"
                  strokeWidth="3"
                  strokeLinecap="round"
                ></path>
              </g>
            </g>
          </svg>

          <svg
            className="head"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="115.68559"
            height="88.29441"
            viewBox="0,0,115.68559,88.29441"
          >
            <g transform="translate(-191.87889,-75.62023)">
              <g strokeMiterlimit="10">
                <path
                  d=""
                  fill="#ffffff"
                  stroke="none"
                  strokeWidth="0.5"
                  strokeLinecap="butt"
                ></path>
                <path
                  d="M195.12889,128.77752c0,-26.96048 21.33334,-48.81626 47.64934,-48.81626c26.316,0 47.64935,21.85578 47.64935,48.81626c0,0.60102 -9.22352,20.49284 -9.22352,20.49284l-7.75885,0.35623l-7.59417,6.15039l-8.64295,-1.74822l-11.70703,6.06119l-6.38599,-4.79382l-6.45999,2.36133l-7.01451,-7.38888l-8.11916,1.29382l-6.19237,-6.07265l-7.6263,-1.37795l-4.19835,-7.87062l-4.24236,-4.16907c0,0 -0.13314,-2.0999 -0.13314,-3.29458z"
                  fill="none"
                  stroke="#2f3a50"
                  strokeWidth="6"
                  strokeLinecap="butt"
                ></path>
                <path
                  d="M195.31785,124.43649c0,-26.96048 21.33334,-48.81626 47.64934,-48.81626c26.316,0 47.64935,21.85578 47.64935,48.81626c0,1.03481 -0.08666,2.8866 -0.08666,2.8866c0,0 16.8538,15.99287 16.21847,17.23929c-0.66726,1.30905 -23.05667,-4.14265 -23.05667,-4.14265l-2.29866,4.5096l-7.75885,0.35623l-7.59417,6.15039l-8.64295,-1.74822l-11.70703,6.06119l-6.38599,-4.79382l-6.45999,2.36133l-7.01451,-7.38888l-8.11916,1.29382l-6.19237,-6.07265l-7.6263,-1.37795l-4.19835,-7.87062l-4.24236,-4.16907c0,0 -0.13314,-2.0999 -0.13314,-3.29458z"
                  fill="#191e2e"
                  strokeOpacity="0.48627"
                  stroke="#ffffff"
                  strokeWidth="0"
                  strokeLinecap="butt"
                ></path>
                <path
                  d="M271.10348,122.46768l10.06374,-3.28166l24.06547,24.28424"
                  fill="none"
                  stroke="#2f3a50"
                  strokeWidth="6"
                  strokeLinecap="round"
                ></path>
                <path
                  d="M306.56448,144.85764l-41.62024,-8.16845l2.44004,-7.87698"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                ></path>
                <path
                  d="M276.02738,115.72434c-0.66448,-4.64715 2.56411,-8.95308 7.21127,-9.61756c4.64715,-0.66448 8.95309,2.56411 9.61757,7.21126c0.46467,3.24972 -1.94776,8.02206 -5.96624,9.09336c-2.11289,-1.73012 -5.08673,-5.03426 -5.08673,-5.03426c0,0 -4.12095,1.16329 -4.60481,1.54229c-0.16433,-0.04891 -0.62732,-0.38126 -0.72803,-0.61269c-0.30602,-0.70328 -0.36302,-2.02286 -0.44303,-2.58239z"
                  fill="#ffffff"
                  stroke="none"
                  strokeWidth="0.5"
                  strokeLinecap="butt"
                ></path>
                <path
                  d="M242.49281,125.6424c0,-4.69442 3.80558,-8.5 8.5,-8.5c4.69442,0 8.5,3.80558 8.5,8.5c0,4.69442 -3.80558,8.5 -8.5,8.5c-4.69442,0 -8.5,-3.80558 -8.5,-8.5z"
                  fill="#ffffff"
                  stroke="none"
                  strokeWidth="0.5"
                  strokeLinecap="butt"
                ></path>
                <path
                  d=""
                  fillOpacity="0.26667"
                  fill="#97affd"
                  strokeOpacity="0.48627"
                  stroke="#ffffff"
                  strokeWidth="0"
                  strokeLinecap="butt"
                ></path>
              </g>
            </g>
          </svg>
        </div>

        <svg
          id="gnd"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="475"
          height="530"
          viewBox="0,0,163.40011,85.20095"
        >
          <g transform="translate(-176.25,-207.64957)">
            <g
              stroke="#000000"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeMiterlimit="10"
            >
              <path
                d="M295.5,273.1829c0,0 -57.38915,6.69521 -76.94095,-9.01465c-13.65063,-10.50609 15.70098,-20.69467 -2.5451,-19.94465c-30.31027,2.05753 -38.51396,-26.84135 -38.51396,-26.84135c0,0 6.50084,13.30023 18.93224,19.17888c9.53286,4.50796 26.23632,-1.02541 32.09529,4.95137c3.62417,3.69704 2.8012,6.33005 0.66517,8.49452c-3.79415,3.84467 -11.7312,6.21103 -6.24682,10.43645c22.01082,16.95812 72.55412,12.73944 72.55412,12.73944z"
                fill="#000000"
              ></path>
              <path
                d="M338.92138,217.76285c0,0 -17.49626,12.55408 -45.36424,10.00353c-8.39872,-0.76867 -17.29557,-6.23066 -17.29557,-6.23066c0,0 3.06461,-2.23972 15.41857,0.72484c26.30467,6.31228 47.24124,-4.49771 47.24124,-4.49771z"
                fill="#000000"
              ></path>
              <path
                d="M209.14443,223.00182l1.34223,15.4356l-10.0667,-15.4356"
                fill="none"
              ></path>
              <path
                d="M198.20391,230.41806l12.95386,7.34824l6.71113,-12.08004"
                fill="none"
              ></path>
              <path d="M211.19621,238.53825l8.5262,-6.09014" fill="none"></path>
              <path
                d="M317.57068,215.80173l5.27812,6.49615l0.40601,-13.39831"
                fill="none"
              ></path>
              <path d="M323.66082,222.70389l6.09014,-9.33822" fill="none"></path>
            </g>
          </g>
        </svg>
      </div>

      <style>{`
        .walking-loader-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, #2c3e50 0%, #34495e 100%);
          position: relative;
          overflow: hidden;
        }

        /* Stars Animation */
        @keyframes snow {
          0% {
            opacity: 0;
            transform: translateY(0px);
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: translateY(650px);
          }
        }

        .box-of-star1,
        .box-of-star2,
        .box-of-star3,
        .box-of-star4 {
          width: 100%;
          position: absolute;
          z-index: 1;
          left: 0;
          top: 0;
          transform: translateY(0px);
          height: 700px;
        }

        .box-of-star1 {
          animation: snow 5s linear infinite;
        }

        .box-of-star2 {
          animation: snow 5s -1.64s linear infinite;
        }

        .box-of-star3 {
          animation: snow 5s -2.30s linear infinite;
        }

        .box-of-star4 {
          animation: snow 5s -3.30s linear infinite;
        }

        .star {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background-color: #FFF;
          position: absolute;
          z-index: 1;
          opacity: 0.7;
        }

        .star:before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #FFF;
          position: absolute;
          z-index: 1;
          top: 80px;
          left: 70px;
          opacity: .7;
        }

        .star:after {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #FFF;
          position: absolute;
          z-index: 1;
          top: 8px;
          left: 170px;
          opacity: .9;
        }

        .star-position1 {
          top: 30px;
          left: 20px;
        }

        .star-position2 {
          top: 110px;
          left: 250px;
        }

        .star-position3 {
          top: 60px;
          left: 570px;
        }

        .star-position4 {
          top: 120px;
          left: 900px;
        }

        .star-position5 {
          top: 20px;
          left: 1120px;
        }

        .star-position6 {
          top: 90px;
          left: 1280px;
        }

        .star-position7 {
          top: 30px;
          left: 1480px;
        }

        .loader.walking-loader {
          z-index: 10;
          scale: 0.75;
          position: relative;
          width: 200px;
          height: 200px;
          translate: 10px -20px;
        }
        .loader.walking-loader svg {
          position: absolute;
          top: 0;
          left: 0;
        }
        .head {
          translate: 27px -30px;
          z-index: 3;
          animation: bob 1s infinite ease-in;
        }
        .bod {
          translate: 0px 30px;
          z-index: 3;
          animation: bob 1s infinite ease-in-out;
        }
        .legr {
          translate: 75px 135px;
          z-index: 0;
          animation: rstep 1s infinite ease-in;
          animation-delay: 0.45s;
        }

        .legl {
          translate: 30px 155px;
          z-index: 3;
          animation: lstep 1s infinite ease-in;
        }

        @keyframes bob {
          0% {
            transform: translateY(0) rotate(3deg);
          }
          5% {
            transform: translateY(0) rotate(3deg);
          }
          25% {
            transform: translateY(5px) rotate(0deg);
          }
          50% {
            transform: translateY(0px) rotate(-3deg);
          }
          70% {
            transform: translateY(5px) rotate(0deg);
          }
          100% {
            transform: translateY(0) rotate(3deg);
          }
        }

        @keyframes lstep {
          0% {
            transform: translateY(0) rotate(-5deg);
          }
          33% {
            transform: translateY(-15px) translate(32px) rotate(35deg);
          }
          66% {
            transform: translateY(0) translate(25px) rotate(-25deg);
          }
          100% {
            transform: translateY(0) rotate(-5deg);
          }
        }

        @keyframes rstep {
          0% {
            transform: translateY(0) translate(0px) rotate(-5deg);
          }
          33% {
            transform: translateY(-10px) translate(30px) rotate(35deg);
          }
          66% {
            transform: translateY(0) translate(20px) rotate(-25deg);
          }
          100% {
            transform: translateY(0) translate(0px) rotate(-5deg);
          }
        }

        #gnd {
          translate: -140px 0;
          rotate: 10deg;
          z-index: -1;
          filter: blur(0.5px) drop-shadow(1px 3px 5px #000000);
          opacity: 0.25;
          animation: scroll 5s infinite linear;
        }

        @keyframes scroll {
          0% {
            transform: translateY(25px) translate(50px);
            opacity: 0;
          }
          33% {
            opacity: 0.25;
          }
          66% {
            opacity: 0.25;
          }
          to {
            transform: translateY(-50px) translate(-100px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

// Main Random Loading Screen Component with Triple-Tap Feature
export const RandomLoadingScreen = () => {
  const [loaderType, setLoaderType] = useState<number>(0);
  const [tapCount, setTapCount] = useState<number>(0);
  const [lastTapTime, setLastTapTime] = useState<number>(0);

  useEffect(() => {
    // Randomize loader on mount
    // 0: Blackhole (24.75%)
    // 1: Bicycle (24.75%)
    // 2: Recording (1%) - LAPTOP WITH AUDIO
    // 3: Cube (0%) - DISABLED
    // 4: Walking Character (24.75%)
    // 5: Astronaut (24.75%)
    
    const random = Math.random();
    
    if (random < 0.001) {
      setLoaderType(2); // Recording (1%)
    } else if (random < 0.2575) { // 0.01 + 0.2475
      setLoaderType(0); // Blackhole
    } else if (random < 0.505) { // 0.2575 + 0.2475
      setLoaderType(1); // Bicycle
    } else if (random < 0.7525) { // 0.505 + 0.2475
      setLoaderType(4); // Walking Character
    } else {
      setLoaderType(5); // Astronaut
    }
  }, []);

  const handleTripleTap = () => {
    const currentTime = Date.now();
    
    // Reset if more than 1 second has passed since last tap
    if (currentTime - lastTapTime > 1000) {
      setTapCount(1);
    } else {
      setTapCount(prevCount => prevCount + 1);
    }
    
    setLastTapTime(currentTime);

    // Switch to recording loader on triple tap
    if (tapCount === 2) {
      setLoaderType(2); // Recording loader
      setTapCount(0);
    }
  };

  const renderLoader = () => {
    switch (loaderType) {
      case 0:
        return <BlackholeLoader />;
      case 1:
        return <BicycleLoader />;
      case 2:
        return <RecordingLoader />;
      case 3:
        return <CubeLoader />;
      case 4:
        return <WalkingCharacterLoader />;
      case 5:
        return <AstronautLoader />;
      default:
        return <BlackholeLoader />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
      onClick={handleTripleTap}
      style={{ cursor: 'pointer' }}
    >
      {renderLoader()}
    </motion.div>
  );
};
