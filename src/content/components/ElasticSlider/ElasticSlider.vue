<template>
  <div class="slider-container">
    <Slider
      :default-value="defaultValue"
      :starting-value="startingValue"
      :max-value="maxValue"
      :is-stepped="isStepped"
      :step-size="stepSize"
    >
      <!-- 透传 slots -->
      <template v-for="(_, name) in $slots" #[name]="data" :key="name">
        <slot :name="name" v-bind="data ?? {}" />
      </template>
    </Slider>
  </div>
</template>

<script setup lang="tsx">
import Icon from "@/components/Icon.vue";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion-v";
import {
  defineComponent,
  ref,
  useSlots,
  watchEffect,
  type PropType
} from "vue";
import { RiVolumeDownFill, RiVolumeUpFill } from "vue-icons-plus/ri";

withDefaults(
  defineProps<{
    defaultValue?: number;
    startingValue?: number;
    maxValue?: number;
    isStepped?: boolean;
    stepSize?: number;
  }>(),
  {
    defaultValue: 50,
    startingValue: 0,
    maxValue: 100,
    isStepped: false,
    stepSize: 1,
  }
);

const Slider = defineComponent({
  props: {
    defaultValue: {
      type: Number as PropType<number>,
      default: 0,
    },
    startingValue: {
      type: Number as PropType<number>,
      default: 0,
    },
    maxValue: {
      type: Number as PropType<number>,
      default: 0,
    },
    isStepped: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    stepSize: {
      type: Number as PropType<number>,
      default: 1,
    },
  },
  setup(props) {
    const value = ref(props.defaultValue);
    const sliderRef = ref<HTMLDivElement | null>(null);
    const region = useMotionValue("middle");
    const regionRef = ref("middle");
    useMotionValueEvent(
      region,
      "change",
      (latest) => (regionRef.value = latest)
    );
    const overflow = useMotionValue(0);
    const clientX = useMotionValue(0);
    const scale = useMotionValue(1);
    const opacity = useTransform(scale, [1, 1.2], [0.7, 1]);
    const leftX = useTransform(() => {
      const offset = -overflow.get() / scale.get();
      return region.get() === "left" ? offset : 0;
    });
    const rightX = useTransform(() => {
      const offset = overflow.get() / scale.get();
      return region.get() === "right" ? offset : 0;
    });
    const trackScaleX = useTransform(() => {
      if (sliderRef.value) {
        const { width } = sliderRef.value.getBoundingClientRect();
        return 1 + overflow.get() / width;
      }
    });
    const trackScaleY = useTransform(overflow, [0, MAX_OVERFLOW], [1, 0.8]);
    const trackTransformOrigin = useTransform(() => {
      if (sliderRef.value) {
        const { left, width } = sliderRef.value.getBoundingClientRect();
        return clientX.get() < left + width / 2 ? "right" : "left";
      } else {
        return 0;
      }
    });
    const trackHeight = useTransform(scale, [1, 1.2], [6, 12]);
    // motion-v 在初始化值为数字的时候不会转为px，所以这里需要手动转换
    const trackHeightWithPx = useTransform(trackHeight, (v) => `${v}px`);
    const trackMarginTop = useTransform(scale, [1, 1.2], [0, -3]);
    const trackMarginBottom = useTransform(scale, [1, 1.2], [0, -3]);

    watchEffect(() => (value.value = props.defaultValue));

    useMotionValueEvent(clientX, "change", (latest) => {
      if (sliderRef.value) {
        const { left, right } = sliderRef.value.getBoundingClientRect();
        let newValue;

        if (latest < left) {
          region.set("left");
          newValue = left - latest;
        } else if (latest > right) {
          region.set("right");
          newValue = latest - right;
        } else {
          region.set("middle");
          newValue = 0;
        }

        overflow.jump(decay(newValue, MAX_OVERFLOW));
      }
    });

    const handlePointerMove = (e: PointerEvent) => {
      const { maxValue, startingValue, isStepped, stepSize } = props;
      if (e.buttons > 0 && sliderRef.value) {
        const { left, width } = sliderRef.value.getBoundingClientRect();
        let newValue =
          startingValue +
          ((e.clientX - left) / width) * (maxValue - startingValue);

        if (isStepped) {
          newValue = Math.round(newValue / stepSize) * stepSize;
        }

        // Clamp the value between startingValue and maxValue
        newValue = Math.min(Math.max(newValue, startingValue), maxValue);
        value.value = newValue;
        clientX.jump(e.clientX);
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      handlePointerMove(e);
      (e.currentTarget as Element)?.setPointerCapture(e.pointerId);
    };

    const handlePointerUp = () => {
      animate(overflow, 0, { type: "spring", bounce: 0.5 });
    };

    const getRangePercentage = () => {
      // Calculate percentage based on startingValue and maxValue
      const { maxValue, startingValue } = props;
      const totalRange = maxValue - startingValue;
      if (totalRange === 0) return 0;

      return ((value.value - startingValue) / totalRange) * 100;
    };

    const slots = useSlots();

    return () => (
      <>
        <motion.div
          onHoverStart={() => animate(scale, 1.2)}
          onHoverEnd={() => animate(scale, 1)}
          onTouchstart={() => animate(scale, 1.2)}
          onTouchend={() => animate(scale, 1)}
          style={{ scale, opacity }}
          class="slider-wrapper"
        >
          <motion.div
            animate={{
              scale: regionRef.value === "left" ? [1, 1.4, 1] : 1,
              transition: { duration: 0.25 },
            }}
            style={{
              x: leftX,
            }}
          >
            {slots.left?.() ?? <Icon as={RiVolumeDownFill} size={16} />}
          </motion.div>

          <div
            ref={sliderRef}
            class="slider-root"
            onPointermove={handlePointerMove}
            onPointerdown={handlePointerDown}
            onPointerup={handlePointerUp}
          >
            <motion.div
              style={{
                scaleX: trackScaleX,
                scaleY: trackScaleY,
                transformOrigin: trackTransformOrigin,
                height: trackHeightWithPx,
                marginTop: trackMarginTop,
                marginBottom: trackMarginBottom,
              }}
              class="slider-track-wrapper"
            >
              <div class="slider-track">
                <div
                  class="slider-range"
                  style={{ width: `${getRangePercentage()}%` }}
                />
              </div>
            </motion.div>
          </div>

          <motion.div
            animate={{
              scale: regionRef.value === "right" ? [1, 1.4, 1] : 1,
              transition: { duration: 0.25 },
            }}
            style={{
              x: rightX,
            }}
          >
            {slots.right?.() ?? <Icon as={RiVolumeUpFill} size={16} />}
          </motion.div>
        </motion.div>
        <p class="value-indicator">{Math.round(value.value)}</p>
      </>
    );
  },
});

const MAX_OVERFLOW = 50;

// Sigmoid-based decay function
function decay(value: number, max: number) {
  if (max === 0) {
    return 0;
  }

  const entry = value / max;
  const sigmoid = 2 * (1 / (1 + Math.exp(-entry)) - 0.5);

  return sigmoid * max;
}
</script>

<style>
.slider-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: 12rem;
}

.slider-wrapper {
  display: flex;
  width: 100%;
  touch-action: none;
  user-select: none;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.slider-root {
  position: relative;
  display: flex;
  width: 100%;
  max-width: 200px;
  flex-grow: 1;
  cursor: grab;
  touch-action: none;
  user-select: none;
  align-items: center;
  padding: 1rem 0;
}

.slider-root:active {
  cursor: grabbing;
}

.slider-track-wrapper {
  display: flex;
  flex-grow: 1;
}

.slider-track {
  position: relative;
  height: 100%;
  flex-grow: 1;
  overflow: hidden;
  border-radius: 9999px;
  background-color: rgba(128, 128, 128, 0.4);
}

.slider-range {
  position: absolute;
  height: 100%;
  background-color: #888;
  border-radius: 9999px;
}

.value-indicator {
  color: #808080;
  position: absolute;
  transform: translateY(-1rem);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.05em;
}

.icon {
  width: 24px;
  height: 24px;
  color: #888;
}

.icon.dark {
  color: #ddd;
}
</style>
