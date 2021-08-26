export interface UppConfig {
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
      graphs?: string;
      staticSite?: string;
      summary?: string;
      uptime?: string;
   };
   commitMessages?: {
      readmeContent?: string;
      summaryJson?: string;
      statusChange?: string;
      graphsUpdate?: string;
      commitAuthorName?: string;
      commitAuthorEmail?: string;
   };
   commitPrefixStatusUp?: string;
   commitPrefixStatusDown?: string;
   commitPrefixStatusDegraded?: string;
   commits?: {
      provider?: 'GitHub';
   };
}
export interface SiteHistory {
   url: string;
   status: 'up' | 'down' | 'degraded';
   code: number;
   responseTime: number;
   lastUpdated?: string;
   startTime?: string;
   generator: 'Upptime <https://github.com/upptime/upptime>';
}
export interface SiteStatus {
   url: string;
   status: 'up' | 'down' | 'degraded';
   code: number;
   responseTime: number;
}
