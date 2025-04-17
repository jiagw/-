$(document).ready(function() {
    // 获取当前日期
    const today = new Date();
    let currentDate = new Date();
    let selectedDate = null; // 初始没有选中日期

    // 初始化日历
    function initCalendar() {
        updateCalendarHeader();
        renderCalendar();
    }

    // 更新日历头部显示
    function updateCalendarHeader() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        $('.calendar-header div span').text(`${year}/${month.toString().padStart(2, '0')}`);
    }

    // 渲染日历表格
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // 获取当月第一天是星期几
        const firstDay = new Date(year, month, 1).getDay();
        // 获取当月天数
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // 计算当前月需要的行数
        const rowsNeeded = Math.ceil((firstDay + daysInMonth) / 7);

        // 清空表格
        $('.calendar-table tbody').remove();
        const tbody = $('<tbody>');

        // 根据当前月需要的行数决定显示方式
        if (rowsNeeded === 4) {
            let currentMonthDay = 1; // 当前月从第1天开始

            // 创建日历行
            for (let i = 0; i < 6; i++) {
                const row = $('<tr>');

                for (let j = 0; j < 7; j++) {
                    const cell = $('<td>');

                    // 第一行且在当前月第一天之前的单元格，显示空白
                    if (i === 0 && j < firstDay) {
                        cell.addClass('empty-cell');
                    }
                    // 如果超出了当前月的天数，则显示空白
                    else if (currentMonthDay > daysInMonth) {
                        cell.addClass('empty-cell');
                    }
                    // 显示当前月日期
                    else {
                        const span = $('<span>').text(currentMonthDay);
                        cell.append(span);

                        // 检查当前单元格是否是选中的日期
                        const isSelected = selectedDate &&
                                        currentMonthDay === selectedDate.getDate() &&
                                        month === selectedDate.getMonth() &&
                                        year === selectedDate.getFullYear();

                        // 检查当前单元格是否是今天
                        const isToday = currentMonthDay === today.getDate() &&
                                      month === today.getMonth() &&
                                      year === today.getFullYear();

                        // 只有在没有任何日期被选中时，今天才显示特殊样式
                        // 否则今天就和其他日期一样显示普通样式
                        if (isSelected) {
                            cell.addClass('selected');
                        } else if (isToday && !selectedDate) {
                            cell.addClass('today');
                        }

                        // 添加点击事件
                        const date = currentMonthDay; // 保存当前日期值，避免闭包问题
                        cell.on('click', function() {
                            // 移除之前选中的日期样式
                            $('.calendar-table td.selected').removeClass('selected');
                            // 移除所有today样式，因为一旦有选中就不再显示today样式
                            $('.calendar-table td.today').removeClass('today');
                            // 添加新的选中样式
                            $(this).addClass('selected');
                            // 更新选中的日期
                            selectedDate = new Date(year, month, date);
                            // 显示选中的日期
                            // showSelectedDate();
                            // 显示选中日期的日程
                            showDailySchedule(selectedDate);
                        });

                        currentMonthDay++;
                    }

                    row.append(cell);
                }

                tbody.append(row);

                // 如果已经显示完当前月所有日期，不再继续
                if (currentMonthDay > daysInMonth) {
                    break;
                }
            }
        } else {
            let date = 1;

            // 创建日历行
            for (let i = 0; i < 6; i++) {
                const row = $('<tr>');

                for (let j = 0; j < 7; j++) {
                    const cell = $('<td>');

                    // 第一行且在当前月第一天之前的单元格，显示空白
                    if (i === 0 && j < firstDay) {
                        cell.addClass('empty-cell');
                    }
                    // 已经显示完当前月所有日期，显示空白
                    else if (date > daysInMonth) {
                        cell.addClass('empty-cell');
                    }
                    // 显示当前月日期
                    else {
                        const span = $('<span>').text(date);
                        cell.append(span);

                        // 检查当前单元格是否是选中的日期
                        const isSelected = selectedDate &&
                                        date === selectedDate.getDate() &&
                                        month === selectedDate.getMonth() &&
                                        year === selectedDate.getFullYear();

                        // 检查当前单元格是否是今天
                        const isToday = date === today.getDate() &&
                                      month === today.getMonth() &&
                                      year === today.getFullYear();

                        // 只有在没有任何日期被选中时，今天才显示特殊样式
                        // 否则今天就和其他日期一样显示普通样式
                        if (isSelected) {
                            cell.addClass('selected');
                        } else if (isToday && !selectedDate) {
                            cell.addClass('today');
                        }

                        // 添加点击事件（仅对有数字的单元格）
                        const currentDate = date; // 保存当前日期值，避免闭包问题
                        cell.on('click', function() {
                            // 移除之前选中的日期样式
                            $('.calendar-table td.selected').removeClass('selected');
                            // 移除所有today样式，因为一旦有选中就不再显示today样式
                            $('.calendar-table td.today').removeClass('today');
                            // 添加新的选中样式
                            $(this).addClass('selected');
                            // 更新选中的日期
                            selectedDate = new Date(year, month, currentDate);
                            // 显示选中的日期
                            // showSelectedDate();
                            // 显示选中日期的日程
                            showDailySchedule(selectedDate);
                        });

                        date++;
                    }

                    row.append(cell);
                }

                tbody.append(row);

                // 如果已经显示完当前月所有日期，不再继续
                if (date > daysInMonth) {
                    break;
                }
            }
        }

        $('.calendar-table').append(tbody);

        // 初始显示选中的日期
        // showSelectedDate();
    }

    // 显示选中的日期
    function showSelectedDate() {
        if (!selectedDate) return;

        // 确保日期信息容器存在
        if ($('.selected-date-info').length === 0) {
            const dateInfo = $('<div class="selected-date-info"></div>');
            $('.calendar-container').append(dateInfo);
        }

        // 格式化日期
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1;
        const date = selectedDate.getDate();
        const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        const weekday = weekdays[selectedDate.getDay()];

        // 更新日期信息
        $('.selected-date-info').html(`
            <div>选中日期: ${year}年${month}月${date}日 ${weekday}</div>
        `);
    }

    // 上个月按钮点击事件
    $('.calendar-header button:contains("<")').on('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        initCalendar();
    });

    // 下个月按钮点击事件
    $('.calendar-header button:contains(">")').on('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        initCalendar();
    });

    // 今天按钮点击事件
    $('.calendar-header button:contains("今天")').on('click', function() {
        currentDate = new Date();
        // 选中今天的日期
        selectedDate = new Date();
        initCalendar();
        // showSelectedDate();
        
        // 显示今天的日程
        showDailySchedule(selectedDate);
    });

    // 初始化日历
    initCalendar();

    // 定义全局变量用于存储token
    let token = '';

    $.ajax({
        type: "POST",
        url: "http://127.0.0.1:8080/seeyon/rest/token",
        headers: {
            'Accept': 'application/json'
        },
        data: JSON.stringify({ userName: 'userName', password: 'password',loginName: 'admin' }),
        async: true,
        success: function (res) {
            var jData = JSON.parse(res);
            if (jData.id !== -1){
                token = jData.id;

            
            }
        },
        error: function (err, txt) {
            console.error(err.responseText);
        }
    });

 
    // 获取事件列表
    function getEvents(token) {
        $.ajax({
            type: "GET",
            url: `http://127.0.0.1:8080/seeyon/rest/mh/event?token=${token}`,
            headers: {
                'Accept': 'application/json'
            },
            async: true,
            success: function (res) {
                console.log('事件数据:', res);
                // 处理获取到的事件数据
                processEvents(res);
            },
            error: function (err, txt) {
                console.error('获取事件失败:', err.responseText);
                // 模拟数据用于测试
                processEvents([
                    {
                        "id": 123456789,
                        "title": "项目进度会议",
                        "startTime": "2023-05-15 09:30:00",
                        "endTime": "2023-05-15 11:00:00",
                        "location": "会议室A",
                        "description": "讨论项目进度和问题解决方案"
                    },
                    {
                        "id": 987654321,
                        "title": "技术评审",
                        "startTime": "2023-05-15 14:00:00",
                        "endTime": "2023-05-15 15:30:00",
                        "location": "线上会议",
                        "description": "评审新版本技术方案"
                    }
                ]);
            }
        });
    }
    
    // 处理事件数据
    function processEvents(events) {
        // 保存事件数据到全局变量
        window.allEvents = events || [];
        
        // 默认显示今天或选中日期的事件
        showDailySchedule();
    }
    
    // 显示指定日期的日程
    function showDailySchedule(date) {
        // 如果没有指定日期，则使用选中的日期或今天
        const targetDate = date || selectedDate || new Date();
        
        // 获取年、月、日，用于比较
        const year = targetDate.getFullYear();
        const month = targetDate.getMonth();
        const day = targetDate.getDate();
        
        // 筛选指定日期的事件
        const dailyEvents = window.allEvents ? window.allEvents.filter(event => {
            // 解析事件的开始时间
            const eventDate = new Date(event.startTime);
            return eventDate.getFullYear() === year &&
                   eventDate.getMonth() === month &&
                   eventDate.getDate() === day;
        }) : [];
        
        // 获取日程列表容器
        const $scheduleList = $('.schedule-list');
        const $noSchedule = $('.no-schedule');
        
        // 清空现有内容
        $scheduleList.empty();
        
        // 检查是否有日程
        if (!dailyEvents || dailyEvents.length === 0) {
            $noSchedule.show();
            return;
        }
        
        // 隐藏"暂无日程"提示
        $noSchedule.hide();
        
        // 按开始时间排序
        dailyEvents.sort((a, b) => {
            return new Date(a.startTime) - new Date(b.startTime);
        });
        
        // 遍历日程并添加到列表
        dailyEvents.forEach(event => {
            // 格式化开始和结束时间，只显示时分
            const startTime = formatTime(event.startTime);
            const endTime = formatTime(event.endTime);
            
            // 创建日程项元素
            const $scheduleItem = $(`
                <li class="schedule-item">
                    <div class="schedule-time">${startTime} - ${endTime}</div>
                    <div class="schedule-title">${event.title}</div>
                    ${event.location ? `<div class="schedule-location">地点: ${event.location}</div>` : ''}
                </li>
            `);
            
            // 添加到容器中
            $scheduleList.append($scheduleItem);
        });
    }
    
    // 格式化时间，只显示时分
    function formatTime(timeString) {
        if (!timeString) return '';
        
        const date = new Date(timeString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        return `${hours}:${minutes}`;
    }
    
    // 显示初始日期的日程
    showDailySchedule(selectedDate || new Date());
});
