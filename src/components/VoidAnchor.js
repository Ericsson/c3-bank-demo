import React from 'react';

export default React.createClass({
    _handleClick(event) {
        event.preventDefault();
        if (this.props.onClick) {
            this.props.onClick(event);
        }
    },
    render() {
        return (
            <a {...this.props} href="#" onClick={this._handleClick}>
                {this.props.children}
            </a>
        )
    },
});
