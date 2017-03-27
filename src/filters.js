import Timeago from 'timeago.js'

const timeago = new Timeago()

export default {
    // 获取topic标签
    tabToLabel(tab, top, good) {
        if (top) {
            return '置顶'
        }
        if (good) {
            return '精华'
        }
        switch (tab) {
            case 'share':
                return '分享'
            case 'ask':
                return '问答'
            case 'job':
                return '招聘'
        }
    },
    // 格式化时间
    formatTime(time) {
        return timeago.format(time, 'zh_CN')
    },
    formatMsg(msg) {
        let index = msg.indexOf(' ')
        return msg.slice(index)
    }
}
