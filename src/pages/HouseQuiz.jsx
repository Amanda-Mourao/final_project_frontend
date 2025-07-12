import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Bilder und Fragen als Variabel
const HALL_BG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1752250322/ChatGPT_Image_11._Juli_2025_18_11_34_cwnhk4.png";

const QUESTIONS = [
  {
    question: "If you were a part of a bicycle, what would you be?",
    options: [
      {
        text: "The wheels. I keep things moving and push forward",
        house: "Gryffindor",
      },
      {
        text: "The gears. I optimize power and control outcomes",
        house: "Slytherin",
      },
      {
        text: "The chain. I connect everything and keep it running",
        house: "Hufflepuff",
      },
      {
        text: "The handlebars. I steer with thought and direction",
        house: "Ravenclaw",
      },
    ],
  },
  {
    question: "You witness someone being treated unfairly. What do you do?",
    options: [
      {
        text: "Offer quiet support. I'll be there for them",
        house: "Hufflepuff",
      },
      { text: "Analyze and resolve the situation calmly.", house: "Ravenclaw" },
      {
        text: "Step in immediately. I can't stand injustice",
        house: "Gryffindor",
      },
      {
        text: "Act strategically if I can make a real impact",
        house: "Slytherin",
      },
    ],
  },
  {
    question:
      "Imagine you could choose any superpower. Which one would you pick?",
    options: [
      { text: "Instantly mastering any skill or language", house: "Ravenclaw" },
      { text: "Rapidly healing yourself and others", house: "Hufflepuff" },
      { text: "Moving objects with your mind", house: "Gryffindor" },
      { text: "Becoming invisible whenever you wish ", house: "Slytherin" },
    ],
  },
  {
    question: "It's your day off. What do you choose to do?",
    options: [
      { text: "Work on a goal or plan your next move", house: "Slytherin" },
      {
        text: "Try something bold or spontaneous",
        house: "Gryffindor",
      },
      {
        text: "Spend time with loved ones or help someone",
        house: "Hufflepuff",
      },
      { text: "Read, learn, or work on a creative idea", house: "Ravenclaw" },
    ],
  },
  {
    question: " How do you respond to setbacks?",
    options: [
      { text: "Stay steady and keep a positive mindset", house: "Hufflepuff" },
      { text: "Reflect and adjust for next time", house: "Ravenclaw" },
      { text: "Push through. I don't give up easily", house: "Gryffindor" },
      { text: "Rethink the strategy and stay focused", house: "Slytherin" },
    ],
  },
];

const HOUSE_WAPPEN = {
  Gryffindor:
    "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751878917/ChatGPT_Image_7._Juli_2025_10_55_51_1_rfptfw.png",
  Slytherin:
    "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751878905/ChatGPT_Image_7._Juli_2025_10_55_51_4_ddz8oh.png",
  Hufflepuff:
    "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751878911/ChatGPT_Image_7._Juli_2025_10_55_51_2_y32nm4.png",
  Ravenclaw:
    "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751878909/ChatGPT_Image_7._Juli_2025_10_55_51_3_dzojes.png",
};

const getResult = (houseCounts) => {
  const max = Math.max(...Object.values(houseCounts));
  const topHouses = Object.entries(houseCounts)
    .filter(([house, count]) => count === max)
    .map(([house]) => house);
  // zufällig bei Gleichstand
  return topHouses[Math.floor(Math.random() * topHouses.length)];
};

export const HouseQuiz = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const navigate = useNavigate();

  const handleAnswer = (house) => {
    if (step < QUESTIONS.length - 1) {
      setAnswers((prev) => [...prev, house]);
      setStep(step + 1);
    } else {
      setAnswers((prev) => [...prev, house]);
      setShowResult(true);
    }
  };

  let resultHouse = null;
  if (showResult) {
    const houseCounts = {
      Gryffindor: 0,
      Slytherin: 0,
      Hufflepuff: 0,
      Ravenclaw: 0,
    };
    answers.forEach((h) => (houseCounts[h] += 1));
    resultHouse = getResult(houseCounts);
  }

  return (
    <div className="relative min-h-screen w-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Background Bild */}
      <img
        src={HALL_BG}
        alt="Mirror Hall"
        className="fixed inset-0 w-full h-full object-top z-0"
        draggable={false}
      />
      {/* Fragen */}
      <div className="absolute left-30 -translate-y-1/2 flex flex-col items-start z-10 w-full md:w-1/2 px-6 md:px-14">
        <div className="text-white font-bold text-2xl md:text-3xl select-none pointer-events-none mb-4">
          {!showResult ? (
            <>
              <div className="mb-4 text-[var(--color-text)] pointer-events-auto">
                <div className="text-lg mb-1 font-semibold"></div>
                <span> {step + 1}. </span>

                {QUESTIONS[step].question}
              </div>
            </>
          ) : (
            <>
              <div className="mb-4 pointer-events-auto"></div>
            </>
          )}
        </div>
        {/* Ergebnis */}
        {!showResult ? (
          <div className="flex flex-col gap-4 w-full pointer-events-auto">
            {QUESTIONS[step].options.map((opt, idx) => (
              <button
                key={idx}
                className="w-full hover:bg-[var(--color-text)]/76 hover:text-black  py-4 pl-4 pr-4 rounded-lg 
                          flex justify-baseline text-xl font-bold bg-[var(--color-b)] shadow-lg text-[var(--color-text)] 
                          disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-700 border-2 
                          border-[var(--color-text)]"
                onClick={() => handleAnswer(opt.house)}
              >
                {opt.text}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center w-full pointer-events-auto">
            <img
              src={HOUSE_WAPPEN[resultHouse]}
              alt={`${resultHouse} crest`}
              className="w-40 h-40 md:w-52 md:h-52 mx-auto object-contain mb-4 drop-shadow-2xl"
              draggable={false}
            />
            <h1 className="text-4xl md:text-5xl font-extrabold text-text text-shadow-lg mb-10 text-center">
              You are a {resultHouse}!
            </h1>
            <button
              onClick={() => navigate("/map")}
              className="relative group active:scale-95 text-[var(--color-text)] font-bold text-lg px-6 py-3 
                        rounded-xl shadow-md border-2 border-[var(--color-text)] transition-all duration-150 
                        uppercase tracking-widest overflow-hidden"
            >
              <span
                className="absolute inset-0 rounded-xl blur-sm bg-[var(--color-text)] opacity-0 
                          group-hover:opacity-30 transition duration-300 animate-pulse"
              />
              <span className="relative z-10">Back to map</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
