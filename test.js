var search = function (nums, target) {
    let head = 0
    let tail = nums.length - 1
    let mid = 0
    let midValue = 0
  
    while (head <= tail) {
      mid = ~~((head + tail) / 2)
      midValue = nums[mid]
      if (midValue === target) return mid
  
      // mid 截断前区间
      if (midValue >= nums[head]) {
        if (target < nums[head]) {
          head = mid + 1 // target 位于截断后
        } else {
          target > midValue ? head = mid + 1 : tail = mid - 1 // target 位于截断前, 判断与 midValue 的关系
        }
      } else {
        // mid 位于截断后 区间
        if (target > nums[tail]) {
          tail = mid - 1 // target 位于 截断前
        } else {
          target > midValue ? head = mid + 1 : tail = mid // target 位于截断后, 判断与 midValue 的关系
        }
      }
    }
    return -1
}

