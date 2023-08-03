import type { RouteRecordRaw } from 'vue-router';
/**
 * 路由meta对象参数说明
 * meta: {
 *      title:          菜单栏及 tagsView 栏、菜单搜索名称（国际化）
 *      hidden：        是否隐藏此路由
 *      icon：          菜单、tagsView 图标，阿里：加 `iconfont xxx`，fontawesome：加 `fa xxx`
 * }
 */

/**
 * 静态路由（默认路由）- 不需要和权限信息进行筛选的路由
 */
 export const staticRoutes: Array<RouteRecordRaw> = [
  {
    path:'/test',
    name:'Test',
    component:()=>import('@/views/test/index.vue'),
    meta:{
      hidden:true//隐藏此路由
    }
  },
	{
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true
    }
  },

  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: {
      hidden: true
    }
  },

  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/home/index.vue'),
      meta: { 
        title: '首页', 
        icon: 'ele-HomeFilled', 
      }
    }]
  },
];



/**
 * 定义动态路由 - 需要和权限信息进行筛选的路由
 */
export const allAsyncRoutes: Array<RouteRecordRaw> = [

  {
    path: "/acl",
    name: "Acl",
    component: () => import("@/layout/index.vue"),
    redirect: "/acl/user/list",
    meta: {
      title: "权限管理",
      icon: "ele-Setting",
    },
    children: [
      {
        name: "User",
        path: "/acl/user/list",
        component: () => import("@/views/acl/user/index.vue"),
        meta: {
          title: "用户管理",
        },
      },
      {
        name: "Role",
        path: "/acl/role/list",
        component: () => import("@/views/acl/role/index.vue"),
        meta: {
          title: "角色管理",
        },
      },
      {
        name: "RoleAuth",
        path: "/acl/role/auth",
        component: () => import("@/views/acl/role/roleAuth.vue"),
        meta: {
          title: "角色管理",
          hidden: true,
          activeMenu: "/acl/role/list",
        },
      },
      {
        name: "Permission",
        path: "/acl/permission/list",
        component: () => import("@/views/acl/permission/index.vue"),
        meta: {
          title: "菜单管理",
        },
      },
    ],
  },





    {
      path: '/product',
      name: 'Product',  // 这里得name属性用来和获取个人信息中权限信息进行对比,如果权限中包含这个那name数据,那么当前路由应该展示
      component: () => import('@/layout/index.vue'),
        meta: { 
          title: '商品管理', 
          icon: 'ele-GoodsFilled', 
        },
        children:[
          {
            path:'trademark',
            name:'Trademark',
            component:()=>import('@/views/product/trademark/index.vue'),
            meta:{
              title:'品牌管理'
            }
          },
          {
            path:'attrs',
            name:'Attr',
            component:()=>import('@/views/product/attrs/index.vue'),
            meta:{
              title:'平台管理属性'
            }
          },
          {
            path:'spu',
            name:'Spu',
            component:()=>import('@/views/product/spu/index.vue'),
            meta:{
              title:'SPU管理'
            }
          },
          {
            path:'sku',
            name:'Sku',
            component:()=>import('@/views/product/sku/index.vue'),
            meta:{
              title:'SKU管理'
            }
          }
        ]
      },
      {
        path:'/order',
        name:'Order',
        component:()=>import('@/layout/index.vue'),
        meta:{
          title:'订单管理',
          icon:'ele-GoodsFilled'
        },
        children:[
          {
            path:'orderlist',
            name:'OrderList',
            component:()=>import('@/views/order/orderlist.vue'),
            meta:{
              title:'订单列表'
            }
          },
          {
            path:'refund',
            name:'Refund',
            component:()=>import('@/views/order/refund.vue'),
            meta:{
              title:'退款管理'
            }
          },
          {
            path:'draggable',
            name:'Draggable',
            component:()=>import('@/views/order/draggable/index.vue'),
            meta:{
              title:'draggable使用'
            }
          }
        ]
      }
    ]


  
    
    
    /**
     * 定义动态路由
    */
   export const anyRoute:RouteRecordRaw = {
     /* 匹配任意的路由 必须最后注册 */
       path: '/:pathMatch(.*)', 
       name: 'Any',
       redirect: '/404', 
       meta: {
         hidden: true 
       }
     }
