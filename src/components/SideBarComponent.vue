<template>
    <div class="sidebar">
        <a-menu id="dddddd" v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" theme="light"
            style="width: 250px" mode="inline" :items="items" @click="handleClick"></a-menu>
    </div>
</template>
<script lang="ts" setup>
import { reactive, ref, watch, VueElement, h } from 'vue';
import { MailOutlined, AppstoreOutlined} from '@ant-design/icons-vue';
import type { MenuProps, ItemType } from 'ant-design-vue';

const selectedKeys = ref<string[]>(['1']);
const openKeys = ref<string[]>(['sub1']);

function getItem(
    label: VueElement | string,
    key: string,
    icon?: any,
    children?: ItemType[],
    type?: 'group',
): ItemType {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as ItemType;
}

const items: ItemType[] = reactive([
    getItem('Navigation One', 'sub1', () => h(MailOutlined), [
        getItem('Item 1', 'g1', null, [getItem('Option 1', '1'), getItem('Option 2', '2')], 'group'),
        getItem('Item 2', 'g2', null, [getItem('Option 3', '3'), getItem('Option 4', '4')], 'group'),
    ]),

    getItem('Navigation Two', 'sub2', () => h(AppstoreOutlined), [
        getItem('Option 5', '5'),
        getItem('Option 6', '6'),
    ]),


    getItem('Group', 'grp', null, [getItem('Option 13', '13'), getItem('Option 14', '14')], 'group'),
]);

const handleClick: MenuProps['onClick'] = e => {
    console.log('click', e);
};

watch(openKeys, val => {
    console.log('openKeys', val);
});
</script>
<style scoped>
.sidebar {
  position: fixed; /* 사이드바를 화면에 고정 */
  top: 0; /* 페이지 상단에서 고정 시작 */
  left: 0; /* 왼쪽에 고정 */
  width: 200px; /* 사이드바 너비 */
  height: 100vh; /* 화면 전체 높이 */
  padding-top: 100px;
  border: 1px solid black;
  overflow-y: auto; /* 사이드바 내용이 길면 스크롤 가능 */
  background-color: white;
}
</style>