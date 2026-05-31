import { useEffect, useMemo, useRef, useState } from 'react'
import './FirstRunOnboarding.css'

const ONBOARDING_QUESTIONS = [
  {
    key: 'name',
    dialogue: "Habitual loops suspended. Behavioral matrix cleared. I am your Adaptive Attention Manager. State your designation to establish a new cognitive baseline.",
    question: 'Enter your designation',
    type: 'text',
  },
  {
    key: 'profession',
    dialogue: "Baseline registered. Welcome, Operator {name}. To tune the anomaly filters, specify the core domain of your high-value operations.",
    question: 'Select your operational domain',
    type: 'choice',
    options: [
      'Software Engineering & Architecture',
      'Data Science & Analytics',
      'Design & Digital Art',
      'Academic Research',
      'Technical Writing & Docs',
      'Systems Management',
    ],
  },
  {
    key: 'work_activities',
    dialogue: "Domain locked. Identify the specific high-focus activities we are guarding against dopamine hijacking.",
    question: 'Select your core focus actions',
    type: 'multi',
    options: [
      'Deep system architecture & coding',
      'Mathematical modeling & scripting',
      'Drafting technical documentation',
      'Analyzing data streams & logs',
      'Synthesizing complex research',
      'High-fidelity visual design',
    ],
  },
  {
    key: 'distractions',
    dialogue: "Telemetry indicates high vulnerability to passive habits. Isolate the primary vector breaking your focus state.",
    question: 'Select your main distraction vectors',
    type: 'multi',
    options: [
      'Algorithmic doomscrolling',
      'Chronic context switching (Excessive tabs)',
      'Asynchronous notifications (Chat/Pings)',
      'Escapist video rabbit holes',
      'Low-friction casual browsing',
      'Cognitive fatigue avoidance',
    ],
  },
  {
    key: 'focus_style',
    dialogue: "Vectors mapped. Now configuring internal pacing. How do you intend to deploy your mental energy blocks?",
    question: 'Select your attention delivery style',
    type: 'choice',
    options: [
      'Deep Dive Marathon (90+ min unbroken)',
      'Tactical Intervals (25-45 min blocks)',
      'Dynamic Shifting (Scales with task weight)',
    ],
  },
  {
    key: 'override_protocol',
    dialogue: "Final check. Breaking hardwired habits requires immediate feedback loops. Select your enforcement threshold when anomaly behavior is detected.",
    question: 'Select your behavioral override protocol',
    type: 'choice',
    options: [
      'Hard Lockdown (Instant process kill)',
      'Mindful Intercept (Forced screen pause)',
      'Gentle Nudge (Subtle desktop telemetry alert)',
    ],
  },
]

function buildInitialAnswers(initialProfile) {
  return ONBOARDING_QUESTIONS.reduce(
    (accumulator, question) => ({
      ...accumulator,
      [question.key]: Array.isArray(initialProfile?.onboarding?.[question.key])
        ? [...initialProfile.onboarding[question.key]]
        : initialProfile?.onboarding?.[question.key] || '',
    }),
    {
      name: initialProfile?.name || '',
    },
  )
}

function formatSelections(values) {
  if (!values || !values.length) return 'None'
  if (values.length === 1) return values[0]
  return values.join(', ')
}

// --------------------------------------------------------
// SLOW LEFT-TO-RIGHT CHARACTER TYPEWRITER BOOT SEQUENCE
// --------------------------------------------------------
function RetroBootSequence({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState([])
  const [currentLineText, setCurrentLineText] = useState("")
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)

  const bootText = useMemo(() => [
    "AAM v1.00 INITIALIZING...",
    "MEMORY ALLOCATION: RECONFIGURING...",
    "BYPASSING COMPULSIVE REWARD CIRCUITS..... OK",
    "DEPRECATING BAD_HABITS.EXE............... DELETED",
    "LOADING ATTENTION_MANAGER.SYS............ DONE",
    "ISOLATING FOCUS ENVIRONMENT.............. LOCKED",
    "BOOT COMPLETE. INITIALIZING OPERATOR DESKTOP...",
  ], [])

  useEffect(() => {
    if (lineIndex >= bootText.length) {
      const delay = setTimeout(onComplete, 600)
      return () => clearTimeout(delay)
    }

    const currentLineFull = bootText[lineIndex]

    if (charIndex < currentLineFull.length) {
      const charTimeout = setTimeout(() => {
        setCurrentLineText((prev) => prev + currentLineFull[charIndex])
        setCharIndex((prev) => prev + 1)
      }, 35) // Speed of character typing (left-to-right)
      return () => clearTimeout(charTimeout)
    } else {
      const lineTimeout = setTimeout(() => {
        setVisibleLines((prev) => [...prev, currentLineFull])
        setCurrentLineText("")
        setCharIndex(0)
        setLineIndex((prev) => prev + 1)
      }, 250) // Pause after finishing a complete line
      return () => clearTimeout(lineTimeout)
    }
  }, [lineIndex, charIndex, bootText, onComplete])

  return (
    <div className="retro-boot-screen">
      <div className="scanlines" />
      <div className="boot-terminal-content">
        {visibleLines.map((line, idx) => (
          <div key={idx} className="boot-line">{line}</div>
        ))}
        <div className="boot-line active-line">
          {currentLineText}
          <span className="boot-cursor">▍</span>
        </div>
      </div>
    </div>
  )
}

// --------------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------------
export function FirstRunOnboarding({ initialProfile, onComplete }) {
  // Stages: 'booting' -> 'powering-on' -> 'active'
  const [stage, setStage] = useState('booting')
  const [answers, setAnswers] = useState(() => buildInitialAnswers(initialProfile))
  const [stepIndex, setStepIndex] = useState(0)
  const [textValue, setTextValue] = useState(initialProfile?.name || '')
  const [dialogueText, setDialogueText] = useState('')
  const [isWriting, setIsWriting] = useState(true)
  const bottomRef = useRef(null)

  const currentQuestion = ONBOARDING_QUESTIONS[stepIndex]
  const isNameStep = currentQuestion?.key === 'name'
  const selectedValues = currentQuestion?.type === 'multi' ? answers[currentQuestion.key] : []
  
  const speakerName = 'System'
  const sceneLine = currentQuestion?.dialogue.replace('{name}', answers.name || 'User') || '...'

  const canContinue = isNameStep
    ? textValue.trim().length > 0
    : currentQuestion?.type === 'multi'
      ? Array.isArray(selectedValues) && selectedValues.length > 0
      : Boolean(answers[currentQuestion?.key])

  const summaryLines = useMemo(() => {
    if (stepIndex < ONBOARDING_QUESTIONS.length) return []

    return [
      `Identity Baseline: ${answers.name}`,
      `Operational Domain: ${answers.profession}`,
      `Protected Behaviors: ${formatSelections(answers.work_activities || [])}`,
      `Intercept Vectors: ${formatSelections(answers.distractions || [])}`,
      `Pacing Architecture: ${answers.focus_style}`,
      `Override Intensity: ${answers.override_protocol}`,
    ]
  }, [answers, stepIndex])

  // Handle CRT screen turning-on transition
  const handleBootComplete = () => {
    setStage('powering-on')
    setTimeout(() => {
      setStage('active')
    }, 700) // Duration of the CRT power animation
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [stepIndex])

  // Main UI Slower Typewriter Text Effect
  useEffect(() => {
    if (stage !== 'active') return

    let active = true
    let cursor = 0
    let intervalId = null

    const bootTimer = window.setTimeout(() => {
      setDialogueText('')
      setIsWriting(true)

      intervalId = window.setInterval(() => {
        if (!active) return

        cursor += 1
        setDialogueText(sceneLine.slice(0, cursor))

        if (cursor >= sceneLine.length) {
          window.clearInterval(intervalId)
          setIsWriting(false)
        }
      }, 45) // Deliberate, slower processing speed for the AI text
    }, 0)

    return () => {
      active = false
      window.clearTimeout(bootTimer)
      if (intervalId) {
        window.clearInterval(intervalId)
      }
    }
  }, [sceneLine, stepIndex, stage])

  const finishOnboarding = (nextAnswers) => {
    onComplete({
      ...initialProfile,
      firstTime: false,
      name: nextAnswers.name,
      onboarding: {
        profession: nextAnswers.profession,
        work_activities: nextAnswers.work_activities || [],
        distractions: nextAnswers.distractions || [],
        focus_style: nextAnswers.focus_style,
        override_protocol: nextAnswers.override_protocol,
      },
    })
  }

  const advanceStep = (field, value) => {
    const nextValue = Array.isArray(value) ? [...value] : value.trim ? value.trim() : value
    const nextAnswers = { ...answers, [field]: nextValue }

    setAnswers(nextAnswers)
    const nextStep = stepIndex + 1
    
    if (nextStep < ONBOARDING_QUESTIONS.length) {
      setStepIndex(nextStep)
      if (ONBOARDING_QUESTIONS[nextStep].type === 'choice') {
        setTextValue('')
      }
      return
    }
    finishOnboarding(nextAnswers)
  }

  const handleTextSubmit = (event) => {
    event.preventDefault()
    if (!canContinue) return
    advanceStep('name', textValue)
  }

  const handleChoice = (choice) => {
    if (!currentQuestion) return

    if (currentQuestion.type === 'multi') {
      const currentSelection = Array.isArray(answers[currentQuestion.key]) ? answers[currentQuestion.key] : []
      const nextSelection = currentSelection.includes(choice)
        ? currentSelection.filter((item) => item !== choice)
        : [...currentSelection, choice]

      setAnswers((current) => ({
        ...current,
        [currentQuestion.key]: nextSelection,
      }))
      return
    }
    advanceStep(currentQuestion.key, choice)
  }

  const handleMultiContinue = () => {
    if (!currentQuestion || currentQuestion.type !== 'multi') return
    advanceStep(
      currentQuestion.key,
      Array.isArray(answers[currentQuestion.key]) ? answers[currentQuestion.key] : [],
    )
  }

  if (stage === 'booting') {
    return <RetroBootSequence onComplete={handleBootComplete} />
  }

  // Wraps app with vintage PC power-on style animation class during transition
  const screenWrapperClass = stage === 'powering-on' ? 'pc-screen-power-on' : 'pc-screen-ready'

  if (!currentQuestion) {
    return (
      <section className={`onboarding-shell ${screenWrapperClass}`}>
         <div className="scanlines" />
         <div className="onboarding-backdrop" />
         <div className="onboarding-panel vn-scene">
            <header className="vn-header">
               <h1>Calibration Matrix Locked</h1>
               <p className="onboarding-lead">Habit constraints configured. System arming complete.</p>
            </header>
            <div className="profile-summary">
              {summaryLines.map((line) => (
                <div key={line} className="summary-line">{line}</div>
              ))}
            </div>
         </div>
      </section>
    )
  }

  return (
    <section className={`onboarding-shell ${screenWrapperClass}`}>
      <div className="scanlines" />
      <div className="onboarding-backdrop" />
      <div className="onboarding-panel">
        <div className="vn-scene">
          <header className="vn-header">
            <p className="onboarding-eyebrow">Behavioral Tuning Engine</p>
            <h1>Attention Vector Setup</h1>
            <div className="vn-status-strip">
              <span className="vn-status-chip">Habit Control: Active</span>
              <span className="vn-status-chip">Anomaly Tracking: Enabled</span>
            </div>
          </header>

          <div className="vn-stage">
            <div className="vn-character mood-focused" aria-hidden="true">
              <div className="vn-portrait-frame">
                <div className="vn-portrait-core">
                  <span className="vn-portrait-sigil">SYS</span>
                </div>
              </div>
            </div>

            <div className="vn-dialogue" aria-live="polite">
              <div className="vn-dialogue-topline">
                <span className="vn-dialogue-name">{speakerName}</span>
                <span className="vn-dialogue-tag">Phase {stepIndex + 1}/{ONBOARDING_QUESTIONS.length}</span>
              </div>

              <p className="vn-dialogue-text">
                <span>{dialogueText}</span>
                <span className={`vn-cursor ${isWriting ? 'active' : ''}`}>▍</span>
              </p>
              <div ref={bottomRef} />
            </div>
          </div>

          <div className="vn-command-bar">
            <div className="vn-question-wrap">
              <h2 className="vn-question">{currentQuestion.question}</h2>
            </div>

            {isNameStep ? (
              <form className="composer-row vn-input-row" onSubmit={handleTextSubmit}>
                <input
                  className="composer-input"
                  type="text"
                  value={textValue}
                  onChange={(event) => setTextValue(event.target.value)}
                  placeholder="Awaiting operator handle..."
                  autoFocus
                />
                <button className="composer-submit" type="submit" disabled={!canContinue}>
                  Initialize Baseline
                </button>
              </form>
            ) : (
              <div className="choice-section">
                <div className="choice-grid vn-choice-grid" role="list">
                  {currentQuestion.options.map((option) => {
                    const isSelected = currentQuestion.type === 'multi'
                      ? Array.isArray(answers[currentQuestion.key]) && answers[currentQuestion.key].includes(option)
                      : answers[currentQuestion.key] === option

                    return (
                      <button
                        key={option}
                        type="button"
                        className={`choice-chip ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleChoice(option)}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>

                {currentQuestion.type === 'multi' ? (
                  <div className="composer-actions">
                    <button
                      className="composer-submit secondary"
                      type="button"
                      onClick={handleMultiContinue}
                      disabled={!canContinue}
                    >
                      Commit Parameters
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}