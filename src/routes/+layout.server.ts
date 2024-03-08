export const load = async ({ locals }) => {
	const user = locals.user;
	console.log(user);
	return {
		user
	};
};
