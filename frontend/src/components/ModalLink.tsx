import React from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import * as H from 'history';

type MLProps = RouteComponentProps<any, any, { background?: H.Location<any> }> & {
    to: string,
    [index: string]: any
};

/**
 * Used for creating links to modals. Useful for saving background location
 *
 * @class ModalLink
 * @extends {React.Component<MLProps>}
 */
class ModalLink extends React.Component<MLProps> {

    render() {
        let { to, location, history, match, staticContext, ...props } = this.props;
        let background = location.state?.background ?? location;

        return <Link to={{ pathname: to, state: { background } }} {...props}>
            {this.props.children}
        </Link>
    }

}

export default withRouter(ModalLink);