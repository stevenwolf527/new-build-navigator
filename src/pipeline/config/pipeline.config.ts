import { PipelineConfig } from "../types";

export const pipelineConfig: PipelineConfig = {
  // Rate limiting — be polite
  max_concurrent_requests: 2,
  request_delay_ms: 2000,
  max_retries: 3,
  retry_delay_ms: 5000,

  // User agent — identify ourselves honestly
  user_agent:
    "CONewBuildNavigator/1.0 (https://conewbuildnavigator.com; community research bot)",

  // Robots.txt
  respect_robots_txt: true,

  // Denver center point (Civic Center Park)
  denver_center: {
    latitude: 39.7392,
    longitude: -104.9903,
  },

  // Radius filter
  radius_miles: 40,

  // Auto-approve threshold
  confidence_auto_approve_threshold: 0.8,

  // Output
  output_dir: "src/pipeline/data",
};
