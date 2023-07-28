import { createRouter, createWebHistory } from 'vue-router';
import { staticRoutes } from '@/router/routes';

const router = createRouter({
	history: createWebHistory(),
	routes: staticRoutes,
  // 不能够直接把所有的路由写在这里注册,应该把筛选之后有权限的路由进行注册
	// routes: staticRoutes.concat(allAsyncRoutes, anyRoute),
  scrollBehavior() {
    return { top: 0, left: 0}
  },
})

// 导出路由
export default router;