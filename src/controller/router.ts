import * as Router from 'koa-router';
import SocketController from './socket_controller';
import AgentController from './agent_controller';

const router = new Router();

new SocketController(router);
new AgentController(router);

router.get('/', async (ctx, next) => {
    ctx.body = 'api server';
});

export default router;