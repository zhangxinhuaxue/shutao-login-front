<template>
    <div>
        
    </div>
</template>

<script>
import { resetphoneResult } from 'src/api/sockpuppet'
export default {
    name: 'sockpuppet-resetphone-confirm',
    created() {
        resetphoneResult({
            orderId: this.$route.query.orderId
        }).then(res => {
            if(res.success) {
                axdApp.close()
            } else {
                this.$router.replace('/sockpuppet/resetphone')
            }
        })
    }
}
</script>

<style>

</style>