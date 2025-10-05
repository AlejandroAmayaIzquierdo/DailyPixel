const EventTypes = {
  CONNECTION: 0x00,
  MESSAGE: 0x01,
  DRAW: 0x02,
  UNKNOWN: 0xff,
} as const;

type EventTypes = (typeof EventTypes)[keyof typeof EventTypes];

export { EventTypes };
