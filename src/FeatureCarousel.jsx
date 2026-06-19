import { forwardRef, useCallback, useEffect, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
} from 'framer-motion'

const cn = (...classes) => classes.filter(Boolean).join(' ')
const placeholderImage = (text = 'Image') =>
  `https://placehold.co/600x400/161618/ffffff?text=${text}`

const TOTAL_STEPS = 4

const steps = [
  {
    id: '1',
    name: 'Frontend',
    title: 'Polished, responsive UI',
    description:
      'React, Vite, and Tailwind front ends — accessible, fast, and built with tasteful motion that never gets in the way.',
  },
  {
    id: '2',
    name: 'Backend & Data',
    title: 'A solid, secure backend',
    description:
      'Spring Boot and REST APIs with Supabase / Firebase for data and authenticated access — wired to the front end cleanly.',
  },
  {
    id: '3',
    name: 'AI & Automation',
    title: 'AI that removes busywork',
    description:
      'LLM integration, RAG, and n8n workflows that quietly automate the manual — set once, runs itself.',
  },
  {
    id: '4',
    name: 'Ship & Deploy',
    title: 'Live, end to end',
    description:
      'From first prototype to a live URL on Vercel — designed, built, and shipped with Claude Code at the center.',
  },
]

const ANIMATION_PRESETS = {
  fadeInScale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { type: 'spring', stiffness: 300, damping: 25, mass: 0.5 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { type: 'spring', stiffness: 300, damping: 25, mass: 0.5 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { type: 'spring', stiffness: 300, damping: 25, mass: 0.5 },
  },
}

function useNumberCycler(totalSteps = TOTAL_STEPS, interval = 5000) {
  const [currentNumber, setCurrentNumber] = useState(0)
  useEffect(() => {
    const timerId = setTimeout(() => {
      setCurrentNumber((prev) => (prev + 1) % totalSteps)
    }, interval)
    return () => clearTimeout(timerId)
  }, [currentNumber, totalSteps, interval])
  const setStep = useCallback(
    (stepIndex) => setCurrentNumber(stepIndex % totalSteps),
    [totalSteps],
  )
  return { currentNumber, setStep }
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkDevice = () =>
      setIsMobile(window.matchMedia('(max-width: 768px)').matches)
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])
  return isMobile
}

function IconCheck({ className, ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" className={cn('h-4 w-4', className)} {...props}>
      <path d="m229.66 77.66-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69 218.34 66.34a8 8 0 0 1 11.32 11.32Z" />
    </svg>
  )
}

const stepVariants = {
  inactive: { scale: 0.9, opacity: 0.7 },
  active: { scale: 1, opacity: 1 },
}

const StepImage = forwardRef(({ src, alt, className, style, ...props }, ref) => (
  <img
    ref={ref}
    alt={alt}
    className={className}
    src={src}
    style={{ position: 'absolute', userSelect: 'none', maxWidth: 'unset', ...style }}
    onError={(e) => (e.currentTarget.src = placeholderImage(alt))}
    {...props}
  />
))
StepImage.displayName = 'StepImage'

const MotionStepImage = motion(StepImage)

const AnimatedStepImage = ({ preset = 'fadeInScale', delay = 0, ...props }) => {
  const presetConfig = ANIMATION_PRESETS[preset]
  return (
    <MotionStepImage
      {...props}
      {...presetConfig}
      transition={{ ...presetConfig.transition, delay }}
    />
  )
}

function FeatureCard({ children, step }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const isMobile = useIsMobile()
  function handleMouseMove({ currentTarget, clientX, clientY }) {
    if (isMobile) return
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }
  return (
    <motion.div
      className="animated-cards group relative w-full rounded-2xl"
      onMouseMove={handleMouseMove}
      style={{ '--x': useMotionTemplate`${mouseX}px`, '--y': useMotionTemplate`${mouseY}px` }}
    >
      <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 transition-colors duration-300">
        <div className="m-8 md:m-10 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              className="flex w-full flex-col gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="text-sm font-semibold uppercase tracking-wider text-white/55"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {steps[step].name}
              </motion.div>
              <motion.h2
                className="text-2xl font-bold tracking-tight text-white md:text-3xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {steps[step].title}
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-base leading-relaxed text-neutral-400">
                  {steps[step].description}
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>
          {children}
        </div>
      </div>
    </motion.div>
  )
}

function StepsNav({ steps: stepItems, current, onChange }) {
  return (
    <nav aria-label="Progress" className="flex justify-center px-4">
      <ol className="flex w-full flex-wrap items-center justify-center gap-2" role="list">
        {stepItems.map((step, stepIdx) => {
          const isCompleted = current > stepIdx
          const isCurrent = current === stepIdx
          return (
            <motion.li key={step.name} initial="inactive" animate={isCurrent ? 'active' : 'inactive'} variants={stepVariants} transition={{ duration: 0.3 }} className="relative">
              <button
                type="button"
                className={cn(
                  'group flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/60 focus-visible:ring-offset-black',
                  isCurrent
                    ? 'bg-white text-black'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700',
                )}
                onClick={() => onChange(stepIdx)}
              >
                <span
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all duration-300',
                    isCompleted
                      ? 'bg-white text-black'
                      : isCurrent
                        ? 'bg-white/30 text-white'
                        : 'bg-neutral-700 text-neutral-200 group-hover:bg-neutral-600',
                  )}
                >
                  {isCompleted ? <IconCheck className="h-3.5 w-3.5" /> : <span>{stepIdx + 1}</span>}
                </span>
                <span className="hidden sm:inline-block">{step.name}</span>
              </button>
            </motion.li>
          )
        })}
      </ol>
    </nav>
  )
}

const defaultClasses = {
  img: 'rounded-xl border border-white/10 shadow-2xl shadow-black/40',
  step1img1: 'w-[50%] left-0 top-[15%]',
  step1img2: 'w-[60%] left-[40%] top-[35%]',
  step2img1: 'w-[50%] left-[5%] top-[20%]',
  step2img2: 'w-[40%] left-[55%] top-[45%]',
  step3img: 'w-[90%] left-[5%] top-[25%]',
  step4img: 'w-[90%] left-[5%] top-[25%]',
}

export function FeatureCarousel({
  image,
  step1img1Class = defaultClasses.step1img1,
  step1img2Class = defaultClasses.step1img2,
  step2img1Class = defaultClasses.step2img1,
  step2img2Class = defaultClasses.step2img2,
  step3imgClass = defaultClasses.step3img,
  step4imgClass = defaultClasses.step4img,
  ...props
}) {
  const { currentNumber: step, setStep } = useNumberCycler()
  const renderStepContent = () => {
    switch (step) {
      case 0:
        return <AnimatedStepImage alt={image.alt} className={cn(defaultClasses.img, 'fc-step-img')} src={image.step1img1} preset="slideInLeft" />
      case 1:
        return <AnimatedStepImage alt={image.alt} className={cn(defaultClasses.img, 'fc-step-img')} src={image.step2img1} preset="slideInRight" />
      case 2:
        return <AnimatedStepImage alt={image.alt} className={cn(defaultClasses.img, 'fc-step-img')} src={image.step3img} preset="fadeInScale" />
      case 3:
        return <AnimatedStepImage alt={image.alt} className={cn(defaultClasses.img, 'fc-step-img')} src={image.step4img} preset="fadeInScale" />
      default:
        return null
    }
  }
  return (
    <div className="flex flex-col gap-12 w-full max-w-4xl mx-auto p-4">
      <FeatureCard {...props} step={step}>
        <AnimatePresence mode="wait">
          <motion.div key={step} {...ANIMATION_PRESETS.fadeInScale} className="mt-8 w-full flex justify-center">
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </FeatureCard>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <StepsNav current={step} onChange={setStep} steps={steps} />
      </motion.div>
    </div>
  )
}
