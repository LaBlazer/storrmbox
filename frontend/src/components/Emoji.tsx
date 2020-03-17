import React from 'react';

type EmojiProps = {
    symbol: string,
    label: string
};

const Emoji = (props: EmojiProps) => (
    <span
        role="img"
        aria-label={props.label ? props.label : ""}
        aria-hidden={props.label ? "false" : "true"}
    >
        {props.symbol}
    </span>
);

export default Emoji;