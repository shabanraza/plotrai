import { useEffect, useRef, useState, type RefObject } from 'react'

interface UseInViewOptions {
  threshold?: number
  triggerOnce?: boolean
  rootMargin?: string
}

interface UseInViewReturn<T extends HTMLElement> {
  ref: RefObject<T | null>
  isInView: boolean
}

export function useInView<T extends HTMLElement = HTMLElement>(
  options?: UseInViewOptions,
): UseInViewReturn<T> {
  const { threshold = 0.2, triggerOnce = true, rootMargin } = options ?? {}
  const ref = useRef<T | null>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (triggerOnce) observer.unobserve(el)
        } else if (!triggerOnce) {
          setIsInView(false)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, triggerOnce, rootMargin])

  return { ref, isInView }
}
