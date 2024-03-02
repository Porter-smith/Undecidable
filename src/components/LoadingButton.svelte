<script>
	import { Button } from './base/button';
	import Spinner from '@/icons/spinner.svg?component';
</script>

<!-- $$restProps let you be able to pass props to the LoadingButton Component 
    example: need to change varient or add classes etc.. 
  -->
<Button {...$$restProps} disabled>
	<Spinner class="mr-2 h-4 w-4" />
	Please wait
</Button>
