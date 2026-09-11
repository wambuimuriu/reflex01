'use client'

import { useEffect, useRef } from 'react'

export function ParticleSwarm() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    let frame = 0
    let width = 0
    let height = 0
    let particles: Array<{ angle: number; radius: number; speed: number; depth: number }> = []

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      const bounds = canvas.getBoundingClientRect()
      width = bounds.width
      height = bounds.height
      canvas.width = width * ratio
      canvas.height = height * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      const count = Math.min(900, Math.max(420, Math.floor((width * height) / 420)))
      particles = Array.from({ length: count }, (_, index) => ({
        angle: (index / count) * Math.PI * 2 + Math.sin(index * 12.7) * 0.7,
        radius: 0.12 + ((index * 0.61803398875) % 1) * 0.82,
        speed: 0.12 + ((index * 0.173) % 1) * 0.3,
        depth: 0.35 + ((index * 0.391) % 1) * 0.65,
      }))
    }

    const draw = (now: number) => {
      const time = now * 0.001
      context.clearRect(0, 0, width, height)
      const centerX = width * 0.54
      const centerY = height * 0.5
      const scale = Math.min(width, height) * 0.42

      for (const particle of particles) {
        const pulse = Math.sin(time * particle.speed + particle.angle * 2) * 0.035
        const orbit = particle.angle + time * (0.08 + particle.speed * 0.14)
        const radius = (particle.radius + pulse) * scale
        const x = centerX + Math.cos(orbit) * radius * 1.25
        const y = centerY + Math.sin(orbit * 1.7) * radius * 0.55
        const size = 0.55 + particle.depth * 1.25
        context.fillStyle = `rgba(112, 169, 155, ${0.08 + particle.depth * 0.18})`
        context.beginPath()
        context.arc(x, y, size, 0, Math.PI * 2)
        context.fill()
      }

      frame = requestAnimationFrame(draw)
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    frame = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className="particle-swarm" aria-hidden="true" />
}
