<script>
	// Add any necessary script logic for the Privacy page here
	import UndecidableLogo from '@/lib/assets/logo.png';
	import { meta } from '@/lib/metaTags';
	const title = meta.privacyPolicy.title;
	const description = meta.privacyPolicy.description;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
</svelte:head>

<div
	class="text-text-color b flex w-full items-center justify-center px-5 py-20 text-center text-base"
>
	<div class="flex flex-col items-center">
		<img src={UndecidableLogo} alt="Undecidable Logo" class="mb-4 w-32" />
		<h1 class="mb-4 text-2xl font-semibold leading-5">Privacy Policy</h1>
		<div class="max-w-md text-sm leading-5 tracking-tight text-neutral-200">
			<p>Effective date: March 9, 2024</p>
			<p>
				The developers of "Undecidable" operate the Undecidable mobile application and website. This
				page informs you of our non-collection policy regarding personal data when you use our
				Service.
			</p>
			<p><strong>Non-Collection of Personal Data:</strong></p>
			<p>
				We do not collect, store, or process any personal data linked to users of our app or
				website. The search queries you enter are used solely to provide movie or TV show
				recommendations and are not stored or associated with any user identity.
			</p>
			<p><strong>Log Data:</strong></p>
			<p>
				We collect only non-personally identifiable information in the event of an error to improve
				our Service. This data is not linked to any personal identifiers.
			</p>
			<p><strong>No Third-Party Data Sharing:</strong></p>
			<p>
				Since we do not collect personal data, we do not share any data with third-party service
				providers or partners.
			</p>
			<p><strong>Security:</strong></p>
			<p>
				While we do not collect personal data, we strive to protect the security of our Service.
			</p>
			<p><strong>Changes to This Privacy Policy:</strong></p>
			<p>
				Our Privacy Policy may change from time to time. We will post any policy changes on this
				page.
			</p>
			<p>
				If you have any questions about this privacy policy, please contact us at
				contact@myundeciable.com
			</p>
		</div>
	</div>
</div>
