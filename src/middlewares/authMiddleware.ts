import jwt from "jsonwebtoken";

const JWT_SECRET = 'OmegaPepegTopSecret123';

const isAuthenticated = async (req: any, res:any, next:any) => {
    try {
        const {authorization} = req.headers;
        const token = authorization.split(' ')[1];
        res.locals.authenticated = await jwt.verify(token, JWT_SECRET, {algorithms: ['HS256']});
        next();
    } catch (e) {
        res.send({error: true, errorMessage: 'User unauthenticated'});
    }
}

export {
    isAuthenticated
}