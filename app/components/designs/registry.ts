import type { Component } from 'vue'

// --- Design Component Registry ---
// To add a new design:
// 1. Create app/components/designs/<design-id>/ with:
//    AddUrlForm.vue, MonitorList.vue (MonitorCard + StatusBadge are internal)
// 2. Import and register below
// 3. Add metadata to useDesign.ts designs array

import ClassicAddUrlForm from './classic/AddUrlForm.vue'
import ClassicMonitorList from './classic/MonitorList.vue'
import ModernAddUrlForm from './modern/AddUrlForm.vue'
import ModernMonitorList from './modern/MonitorList.vue'

export interface DesignComponents {
  AddUrlForm: Component
  MonitorList: Component
}

export const designRegistry: Record<string, DesignComponents> = {
  classic: {
    AddUrlForm: ClassicAddUrlForm,
    MonitorList: ClassicMonitorList,
  },
  modern: {
    AddUrlForm: ModernAddUrlForm,
    MonitorList: ModernMonitorList,
  },
}
