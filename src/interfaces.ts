export interface UppConfig{
   sites: {
      check?: 'http' | 'tcp-ping';
      method?: string;
      name: string;
      url: string;
      port?: number;
      expectedStatusCodes?: number[];
      assignees?: string[];
      headers?: string[];
      slug?: string;
      body?: string;
      icon?: string;
      maxResponseTime?: number;
      maxRedirects?: number;
      __dangerous__insecure?: boolean;
      __dangerous__disable_verify_peer?: boolean;
      __dangerous__disable_verify_host?: boolean;
      __dangerous__body_down?: string;
      __dangerous__body_down_if_text_missing?: string;
      __dangerous__body_degraded?: string;
      __dangerous__body_degraded_if_text_missing?: string;
    }[];
   workflowSchedule?: {
      updates: string;
   };
}
