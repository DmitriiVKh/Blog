import { useSelector } from 'react-redux';
import { Error } from '../error/error';
import { selectUserRole } from '../../selectors';
import { checkAccess } from '../../utils';
import { ERROR, PROP_TYPE } from '../../constants';
import PropTypes from 'prop-types';

export const PrivaneContent = ({ children, access, serverError }) => {
	const userRole = useSelector(selectUserRole);

	const accessError = checkAccess(access, userRole) ? null : ERROR.ACCES_DENIED;

	const error = serverError || accessError;

	return error ? <Error error={error} /> : children;
};

PrivaneContent.propTypes = {
	children: PropTypes.node.isRequired,
	access: PropTypes.arrayOf(PROP_TYPE.ROLE).isRequired,
	serverError: PROP_TYPE.ERROR,
};
