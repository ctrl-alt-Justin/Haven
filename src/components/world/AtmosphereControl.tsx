'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Sun,
  Sunset,
  Moon,
  Volume2,
  VolumeX,
  Sparkles,
  CloudRain,
  Flame,
  Check,
} from 'lucide-react'

export type TimeOfDay = 'day' | 'dusk' | 'night'
export type SoundTheme = 'none' | 'rain' | 'fire'

export default function AtmosphereControl() {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day')
  const [soundTheme, setSoundTheme] = useState<SoundTheme>('none')
  const [calmMode, setCalmMode] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  // Audio Context Ref for Web Audio API synthesis
  const audioCtxRef = useRef<AudioContext | null>(null)
  const noiseNodeRef = useRef<AudioNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

  // Apply atmosphere class to body
  useEffect(() => {
    document.body.classList.remove('atmosphere-day', 'atmosphere-dusk', 'atmosphere-night')
    document.body.classList.add(`atmosphere-${timeOfDay}`)
  }, [timeOfDay])

  // Apply calm mode to body
  useEffect(() => {
    if (calmMode) {
      document.body.classList.add('calm-mode')
    } else {
      document.body.classList.remove('calm-mode')
    }
  }, [calmMode])

  // Web Audio Synthesis for gentle ambient rain or fireplace
  const startSound = (theme: SoundTheme) => {
    stopSound()
    if (theme === 'none') return

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = new AudioCtx()
      audioCtxRef.current = ctx

      const bufferSize = ctx.sampleRate * 2
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)

      // Generate brown / pink noise
      let lastOut = 0.0
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1
        // Brown noise filter for rain or soft fireplace rumble
        data[i] = (lastOut + 0.02 * white) / 1.02
        lastOut = data[i]
        data[i] *= 3.5 // scale
      }

      const noise = ctx.createBufferSource()
      noise.buffer = buffer
      noise.loop = true

      // Filter for rain sound
      const filter = ctx.createBiquadFilter()
      filter.type = theme === 'rain' ? 'lowpass' : 'bandpass'
      filter.frequency.value = theme === 'rain' ? 800 : 400
      filter.Q.value = 1.0

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.08, ctx.currentTime)

      noise.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      noise.start()
      noiseNodeRef.current = noise
      gainNodeRef.current = gain
    } catch (e) {
      console.warn('Web Audio Ambient sound could not start:', e)
    }
  }

  const stopSound = () => {
    try {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close()
      }
    } catch {}
    audioCtxRef.current = null
  }

  const handleSoundToggle = (theme: SoundTheme) => {
    if (soundTheme === theme) {
      setSoundTheme('none')
      stopSound()
    } else {
      setSoundTheme(theme)
      startSound(theme)
    }
  }

  useEffect(() => {
    return () => {
      stopSound()
    }
  }, [])

  return (
    <div className="fixed bottom-20 lg:bottom-5 right-4 z-40">
      {/* Popover Panel */}
      {isOpen && (
        <div className="mb-3 w-64 rounded-2xl storybook-card p-4 space-y-3.5 shadow-lifted animate-in fade-in slide-in-from-bottom-2 duration-200 text-xs">
          <div className="flex items-center justify-between border-b border-cottage-border/70 pb-2">
            <span className="font-serif font-medium text-sm text-cottage-bark flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cottage-moss-deep" />
              <span>World Atmosphere</span>
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-cottage-brown hover:text-cottage-bark p-1 rounded"
            >
              ✕
            </button>
          </div>

          {/* Time of Day */}
          <div className="space-y-1.5">
            <span className="font-medium text-cottage-brown block">Sky & Lighting</span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setTimeOfDay('day')}
                className={`py-1.5 px-2 rounded-xl flex items-center justify-center gap-1 border transition ${
                  timeOfDay === 'day'
                    ? 'bg-amber-100/80 border-amber-300 text-amber-900 font-semibold'
                    : 'bg-white/60 border-cottage-border text-cottage-brown hover:bg-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Day</span>
              </button>
              <button
                onClick={() => setTimeOfDay('dusk')}
                className={`py-1.5 px-2 rounded-xl flex items-center justify-center gap-1 border transition ${
                  timeOfDay === 'dusk'
                    ? 'bg-orange-100/80 border-orange-300 text-orange-950 font-semibold'
                    : 'bg-white/60 border-cottage-border text-cottage-brown hover:bg-white'
                }`}
              >
                <Sunset className="w-3.5 h-3.5" />
                <span>Dusk</span>
              </button>
              <button
                onClick={() => setTimeOfDay('night')}
                className={`py-1.5 px-2 rounded-xl flex items-center justify-center gap-1 border transition ${
                  timeOfDay === 'night'
                    ? 'bg-indigo-100/80 border-indigo-300 text-indigo-950 font-semibold'
                    : 'bg-white/60 border-cottage-border text-cottage-brown hover:bg-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Night</span>
              </button>
            </div>
          </div>

          {/* Ambient Sound */}
          <div className="space-y-1.5">
            <span className="font-medium text-cottage-brown block">Peaceful Ambience</span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleSoundToggle('rain')}
                className={`py-1.5 px-2 rounded-xl flex items-center justify-center gap-1.5 border transition ${
                  soundTheme === 'rain'
                    ? 'bg-cottage-sage border-cottage-moss-deep text-cottage-moss-deep font-semibold'
                    : 'bg-white/60 border-cottage-border text-cottage-brown hover:bg-white'
                }`}
              >
                <CloudRain className="w-3.5 h-3.5" />
                <span>Gentle Rain</span>
              </button>
              <button
                onClick={() => handleSoundToggle('fire')}
                className={`py-1.5 px-2 rounded-xl flex items-center justify-center gap-1.5 border transition ${
                  soundTheme === 'fire'
                    ? 'bg-cottage-rose border-cottage-rose-dark text-cottage-rose-dark font-semibold'
                    : 'bg-white/60 border-cottage-border text-cottage-brown hover:bg-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Hearth Fire</span>
              </button>
            </div>
          </div>

          {/* Calm Mode (Reduced Motion) */}
          <div className="pt-2 border-t border-cottage-border/50 flex items-center justify-between">
            <span className="text-[11px] text-cottage-brown">Calm Motion Mode</span>
            <button
              onClick={() => setCalmMode(!calmMode)}
              className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                calmMode ? 'bg-cottage-moss-deep' : 'bg-cottage-border'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                  calmMode ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2.5 sm:px-3.5 sm:py-2 rounded-full storybook-wood text-white hover:scale-105 transition-all shadow-lifted"
        title="Sanctuary Atmosphere & Sound"
      >
        <Sparkles className="w-4 h-4 text-[#FDE047]" />
        <span className="hidden sm:inline font-serif text-xs tracking-wide">Atmosphere</span>
        {soundTheme !== 'none' && (
          <span className="w-2 h-2 rounded-full bg-[#86EFAC] animate-pulse" />
        )}
      </button>
    </div>
  )
}
