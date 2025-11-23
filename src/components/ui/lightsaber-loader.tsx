export function LightsaberLoader() {
  return (
    <div className="lightsaber-loader-container">
      <div className="ls-particles ls-part-1"></div>
      <div className="ls-particles ls-part-2"></div>
      <div className="ls-particles ls-part-3"></div>
      <div className="ls-particles ls-part-4"></div>
      <div className="ls-particles ls-part-5"></div>
      <div className="lightsaber ls-left ls-gold"></div>
      <div className="lightsaber ls-right ls-gold-bright"></div>

      <style>{`
        .lightsaber-loader-container {
          width: 80px;
          height: 40px;
          position: absolute;
          top: 50%;
          left: 50%;
          margin: -20px -40px;
          z-index: 1000;
        }

        .lightsaber {
          position: absolute;
          width: 4px;
          height: 12px;
          background-color: #666;
          border-radius: 1px;
          bottom: 0;
        }

        .lightsaber.ls-left {
          left: 0;
        }

        .lightsaber.ls-right {
          right: 0;
        }

        .lightsaber:before {
          position: absolute;
          content: ' ';
          display: block;
          width: 2px;
          height: 25px;
          max-height: 1px;
          left: 1px;
          top: 1px;
          background-color: #fff;
          border-radius: 1px;
          transform: rotateZ(180deg);
          transform-origin: center top;
        }

        .lightsaber:after {
          position: absolute;
          content: ' ';
          display: block;
          width: 2px;
          height: 2px;
          left: 1px;
          top: 4px;
          background-color: #fff;
          border-radius: 50%;
        }

        .ls-particles {
          position: absolute;
          left: 42px;
          top: 10px;
          width: 1px;
          height: 5px;
          background-color: rgb(51, 51, 51, 0);
          transform: rotateZ(0deg);
        }

        .lightsaber.ls-gold:before {
          animation: showlightgold 2s ease-in-out infinite 1s;
        }

        .lightsaber.ls-gold-bright:before {
          animation: showlightgoldbright 2s ease-in-out infinite 1s;
        }

        .lightsaber.ls-left {
          animation: fightleft 2s ease-in-out infinite 1s;
        }

        .lightsaber.ls-right {
          animation: fightright 2s ease-in-out infinite 1s;
        }

        .ls-particles.ls-part-1 {
          animation: particles1 2s ease-out infinite 1s;
        }

        .ls-particles.ls-part-2 {
          animation: particles2 2s ease-out infinite 1s;
        }

        .ls-particles.ls-part-3 {
          animation: particles3 2s ease-out infinite 1s;
        }

        .ls-particles.ls-part-4 {
          animation: particles4 2s ease-out infinite 1s;
        }

        .ls-particles.ls-part-5 {
          animation: particles5 2s ease-out infinite 1s;
        }

        @keyframes showlightgold {
          0% {
            max-height: 0;
            box-shadow: 0 0 0 0 #d4af37;
          }
          5% {
            box-shadow: 0 0 4px 2px #d4af37;
          }
          10% {
            max-height: 22px;
          }
          80% {
            max-height: 22px;
          }
          85% {
            box-shadow: 0 0 4px 2px #d4af37;
          }
          100% {
            max-height: 0;
            box-shadow: 0 0 0 0 #d4af37;
          }
        }

        @keyframes showlightgoldbright {
          0% {
            max-height: 0;
            box-shadow: 0 0 0 0 #f4cf47;
          }
          20% {
            box-shadow: 0 0 4px 2px #f4cf47;
          }
          25% {
            max-height: 22px;
          }
          80% {
            max-height: 22px;
          }
          85% {
            box-shadow: 0 0 4px 2px #f4cf47;
          }
          100% {
            max-height: 0;
            box-shadow: 0 0 0 0 #f4cf47;
          }
        }

        @keyframes fightleft {
          0% {
            transform: rotateZ(0deg);
            left: 0;
            bottom: 0;
          }
          30% {
            transform: rotateZ(0deg);
            bottom: 0;
          }
          40% {
            transform: rotateZ(45deg);
            left: 0;
            bottom: 2px;
          }
          45% {
            transform: rotateZ(65deg);
            left: 0;
          }
          65% {
            transform: rotateZ(410deg);
            left: 30px;
            bottom: 10px;
          }
          95% {
            transform: rotateZ(410deg);
            left: 0;
            bottom: 0;
          }
          100% {
            transform: rotateZ(360deg);
            left: 0;
            bottom: 0;
          }
        }

        @keyframes fightright {
          0% {
            transform: rotateZ(0deg);
            right: 0;
            bottom: 0;
          }
          30% {
            transform: rotateZ(0deg);
            bottom: 0;
          }
          45% {
            transform: rotateZ(-45deg);
            right: 0;
            bottom: 2px;
          }
          50% {
            transform: rotateZ(-65deg);
            right: 0;
          }
          68% {
            transform: rotateZ(-410deg);
            right: 27px;
            bottom: 13px;
          }
          95% {
            transform: rotateZ(-410deg);
            right: 0;
            bottom: 0;
          }
          100% {
            transform: rotateZ(-360deg);
            right: 0;
            bottom: 0;
          }
        }

        @keyframes particles1 {
          0% {
            background-color: rgba(212, 175, 55, 0);
            transform: rotateZ(35deg) translateY(0px);
          }
          63% {
            background-color: rgba(212, 175, 55, 0);
            transform: rotateZ(35deg) translateY(0px);
          }
          64% {
            background-color: rgba(212, 175, 55, 1);
            transform: rotateZ(35deg) translateY(0px);
          }
          100% {
            background-color: rgba(212, 175, 55, 0);
            transform: rotateZ(35deg) translateY(-30px);
          }
        }

        @keyframes particles2 {
          0% {
            background-color: rgba(212, 175, 55, 0);
            transform: rotateZ(-65deg) translateY(0px);
          }
          63% {
            background-color: rgba(212, 175, 55, 0);
            transform: rotateZ(-65deg) translateY(0px);
          }
          64% {
            background-color: rgba(212, 175, 55, 1);
            transform: rotateZ(-65deg) translateY(0px);
          }
          95% {
            background-color: rgba(212, 175, 55, 0);
            transform: rotateZ(-65deg) translateY(-40px);
          }
          100% {
            background-color: rgba(212, 175, 55, 0);
            transform: rotateZ(-65deg) translateY(-40px);
          }
        }

        @keyframes particles3 {
          0% {
            background-color: rgba(212, 175, 55, 0);
            transform: rotateZ(-75deg) translateY(0px);
          }
          63% {
            background-color: rgba(212, 175, 55, 0);
            transform: rotateZ(-75deg) translateY(0px);
          }
          64% {
            background-color: rgba(212, 175, 55, 1);
            transform: rotateZ(-75deg) translateY(0px);
          }
          97% {
            background-color: rgba(212, 175, 55, 0);
            transform: rotateZ(-75deg) translateY(-35px);
          }
          100% {
            background-color: rgba(212, 175, 55, 0);
            transform: rotateZ(-75deg) translateY(-35px);
          }
        }

        @keyframes particles4 {
          0% {
            background-color: rgba(212, 175, 55, 0);
            transform: rotateZ(-25deg) translateY(0px);
          }
          63% {
            background-color: rgba(212, 175, 55, 0);
            transform: rotateZ(-25deg) translateY(0px);
          }
          64% {
            background-color: rgba(212, 175, 55, 1);
            transform: rotateZ(-25deg) translateY(0px);
          }
          97% {
            background-color: rgba(212, 175, 55, 0);
            transform: rotateZ(-25deg) translateY(-30px);
          }
          100% {
            background-color: rgba(212, 175, 55, 0);
            transform: rotateZ(-25deg) translateY(-30px);
          }
        }

        @keyframes particles5 {
          0% {
            background-color: rgba(212, 175, 55, 0);
            transform: rotateZ(65deg) translateY(0px);
          }
          63% {
            background-color: rgba(212, 175, 55, 0);
            transform: rotateZ(65deg) translateY(0px);
          }
          64% {
            background-color: rgba(212, 175, 55, 1);
            transform: rotateZ(65deg) translateY(0px);
          }
          97% {
            background-color: rgba(212, 175, 55, 0);
            transform: rotateZ(65deg) translateY(-35px);
          }
          100% {
            background-color: rgba(212, 175, 55, 0);
            transform: rotateZ(65deg) translateY(-35px);
          }
        }
      `}</style>
    </div>
  );
}
