/**
 * @title {{githubUsername}} ({{discordId}})
 */
export interface ProjectUser {
  discordId: string;
  githubUsername: string;
}

/**
 * @title Hora específica
 */
interface SpecificHour {
  /**
   * @default SpecificHour
   * @hide
   */
  type: string;
  /**
   * @format time
   */
  hour: string;
}

/**
 * @title Ao meio dia (12h)
 */
interface OnMidDay {
  /**
   * @default OnMidDay
   * @hide
   */
  type: string;
}

/**
 * @title Começo do Dia (7h)
 */
interface OnStartDay {
  /**
   * @default OnStartDay
   * @hide
   */
  type: string;
}

/**
 * @title Final do Dia (18h)
 */
interface OnEndDay {
  /**
   * @default OnEndDay
   * @hide
   */
  type: string;
}

/**
 * @title Todos os dias
 */
interface EveryDay {
  /**
   * @default EveryDay
   * @hide
   */
  type: string;
}

/**
 * @title Dias úteis
 */
interface BusinessDay {
  /**
   * @default BusinessDay
   * @hide
   */
  type: string;
}

/**
 * @title Dia da semana específica
 */
interface SpecificWeekDay {
  /**
   * @default SpecificWeekDay
   * @hide
   */
  type: string;
  weekDay: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
}

/**
 * @title Dia do mês específico
 */
interface SpecificMonthDay {
  /**
   * @default SpecificMonthDay
   * @hide
   */
  type: string;
  day: number;
}

export type Days = EveryDay | SpecificWeekDay | SpecificMonthDay | BusinessDay;
export type Hours = SpecificHour | OnStartDay | OnMidDay | OnEndDay;
