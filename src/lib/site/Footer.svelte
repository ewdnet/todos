<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { Github } from '@lucide/svelte';
</script>

<p class="text-center">
	<a href="https://ewdnet.github.io/" target="_blank">
		<img src={favicon} alt="" class="inline-block" width="16" height="16" />
		<small>ewdnet</small>
	</a>
	|
	<a href="https://github.com/ewdnet/tasks/" target="_blank">
		<Github size={16} />
		<small>github repo</small>
	</a>
</p>
