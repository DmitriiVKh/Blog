import { useForm } from 'react-hook-form';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { server } from '../../bff';
import { useEffect, useState } from 'react';
import { Input, Button, H2 } from '../../components';
import styled from 'styled-components';
import { setUser } from '../../actions';
import { selectUserRole } from '../../selectors';
import { ROLE } from '../../constants';

const authFormSchema = yup.object().shape({
	login: yup
		.string()
		.required('Заполните логин')
		.matches(/^\w+$/, 'Неверно заполнен логин. Допускаются только буквы и цифры')
		.min(3, 'Неверно заполнен логин. Минимум 3 символа')
		.max(15, 'Неверно заполнен логин. Максимум 15 символа'),
	password: yup
		.string()
		.required('Заполните пароль')
		.matches(
			/^[\w#%]+$/,
			'Неверно зполнен пароль. Допускаются буквы, цифры и знаки # %',
		)
		.min(6, 'Неверно заполнен пароль. Минимум 6 символа')
		.max(30, 'Неверно заполнен пароль. Максимум 30 символа'),
});

const StyledLink = styled(Link)`
	text-align: center;
	text-decoration: underline;
	margin: 20px 0;
	font-size: 18px;
`;

const ErrorMessage = styled.div`
	font-size: 18px;
	margin: 10px 0 0;
	padding: 10px;
	background-color: #fcadad;
`;

const AuthorizationContainer = ({ className }) => {
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			login: '',
			password: '',
		},
		resolver: yupResolver(authFormSchema),
	});

	const [serverError, setServerError] = useState(null);

	const dispatch = useDispatch();

	const store = useStore();

	const roleId = useSelector(selectUserRole);

	useEffect(() => {
		let currentWasLogout = store.getState().app.wasLogout;

		return store.subscribe(() => {
			let previousWasLogout = currentWasLogout;
			currentWasLogout = store.getState().app.wasLogout;

			if (currentWasLogout !== previousWasLogout) {
				reset();
			}
		});
	}, [reset, store]);

	const onSubmit = ({ login, password }) => {
		server
			.authorize(login, password)
			.then((res) => {
				if (res.error) {
					setServerError(res.error);
					return;
				}

				dispatch(setUser(res.res));
			})
			.catch((error) => {
				setServerError(`Ошибка запроса: ${error}`);
			});
	};

	const formError = errors?.login?.message || errors?.password?.message;

	const errorMessage = formError || serverError;

	if (roleId !== ROLE.GUEST) {
		return <Navigate to="/" />;
	}

	return (
		<div className={className}>
			<H2>Авторизация</H2>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Input
					type="text"
					placeholder="Логин..."
					{...register('login', { onChange: () => setServerError(null) })}
				/>
				<Input
					type="password"
					placeholder="Пароль..."
					{...register('password', {
						onChange: () => setServerError(null),
					})}
				/>
				<Button type="submit" disabled={!!formError}>
					Авторизоваться
				</Button>
				{errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
				<StyledLink to="/register">Регистрация</StyledLink>
			</form>
		</div>
	);
};

export const Authorization = styled(AuthorizationContainer)`
	display: flex;
	align-items: center;
	flex-direction: column;

	& > form {
		display: flex;
		flex-direction: column;
		width: 260px;
	}
`;
