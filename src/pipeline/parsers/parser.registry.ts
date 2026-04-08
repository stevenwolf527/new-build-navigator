import { ParseResult } from '../types';
import { GenericCommunityParser } from './generic.parser';
import { logger } from '../utils/logger';

export interface PageParser {
  canParse(url: string, html: string): boolean;
  parse(url: string, html: string): Promise<ParseResult>;
}

export class ParserRegistry {
  private parsers: Map<string, PageParser> = new Map();
  private genericParser: GenericCommunityParser;

  constructor() {
    this.genericParser = new GenericCommunityParser();
  }

  /**
   * Register a domain-specific parser.
   * @param domain - The domain key (e.g. "lennar.com", "drhorton.com")
   * @param parser - A PageParser implementation for that domain
   */
  register(domain: string, parser: PageParser): void {
    const normalizedDomain = domain.toLowerCase().replace(/^www\./, '');
    this.parsers.set(normalizedDomain, parser);
    logger.info("parser-registry", `Registered parser for domain: ${normalizedDomain}`);
  }

  /**
   * Find the best parser for a given URL and HTML content.
   * Tries domain-specific parsers first, then falls back to generic.
   */
  getParser(url: string, html: string): PageParser {
    let domain: string;
    try {
      const parsed = new URL(url);
      domain = parsed.hostname.toLowerCase().replace(/^www\./, '');
    } catch {
      logger.warn("parser-registry", `Could not parse URL "${url}", falling back to generic parser`);
      return this.genericParser;
    }

    // Try exact domain match
    if (this.parsers.has(domain)) {
      const parser = this.parsers.get(domain)!;
      if (parser.canParse(url, html)) {
        logger.debug("parser-registry", `Using domain-specific parser for: ${domain}`);
        return parser;
      }
    }

    // Try parent domain match (e.g. "communities.lennar.com" -> "lennar.com")
    const domainParts = domain.split('.');
    if (domainParts.length > 2) {
      const parentDomain = domainParts.slice(-2).join('.');
      if (this.parsers.has(parentDomain)) {
        const parser = this.parsers.get(parentDomain)!;
        if (parser.canParse(url, html)) {
          logger.debug("parser-registry", `Using parent domain parser for: ${parentDomain}`);
          return parser;
        }
      }
    }

    // Fall back to generic parser
    logger.debug("parser-registry", `No domain-specific parser for "${domain}", using generic parser`);
    return this.genericParser;
  }

  /**
   * Parse a URL's HTML content using the best available parser.
   */
  async parse(url: string, html: string): Promise<ParseResult> {
    const parser = this.getParser(url, html);
    try {
      const result = await parser.parse(url, html);
      logger.info(
        "parser-registry",
        `Parsed "${url}" with confidence ${result.confidence?.toFixed(2) ?? 'N/A'}`
      );
      return result;
    } catch (error) {
      logger.error("parser-registry", `Parser failed for "${url}": ${error}`);
      return {
        success: false,
        record: null,
        errors: [String(error)],
        warnings: [],
        confidence: 0,
      };
    }
  }

  /**
   * Get a list of all registered domain parsers.
   */
  getRegisteredDomains(): string[] {
    return Array.from(this.parsers.keys());
  }
}
